var http    = require('node:http');
var https   = require('node:https');

require('./NamespaceUtils.js');
require('./Logger.js');
require('./JsonRpc.js');
require('./JsonRpcMessageTemplates.js');

MCP_SERVER_URL        = process.env.MCP_SERVER_URL ?? 'http://127.0.0.1:9000/mcp';
PERSONAL_ACCESS_TOKEN = process.env.MCP_PERSONAL_ACCESS_TOKEN ?? '';
        

if (process.argv.length > 2) {
    mcp.LoggingSystem.setLevel(process.argv[2]);
}

var LOG               = mcp.LoggingSystem.createLogger('Main');
var mcpServerUrl      = new URL(MCP_SERVER_URL);
var transportProtocol = (mcpServerUrl.protocol === 'https:') ? https : http;
var connectionAgent   = transportProtocol.Agent({ keepAlive: true });
var messageFactory    = new mcp.jsonrpc.messages.Factory();
var mcpServerPort     = mcpServerUrl.port;
if (mcpServerPort === '') {
    mcpServerPort = (mcpServerUrl.protocol === 'https:') ? 443 : 80;
}

var httpResponseReceived = function httpResponseReceived(messageContainer, resolve, reject, response) {
    LOG.info('Response received (HttpStatusCode=' + response.statusCode + ').');
    filteredHeaderNames = Object.keys(response.headers).filter(headerName => headerName.toUpperCase() === "MCP-SESSION-ID");
    sessionId           = undefined;

    if (filteredHeaderNames.length > 0) {
        sessionId = response.headers[filteredHeaderNames[0]];
    }
    if (sessionId !== undefined) {
        LOG.info('Session ID: ' + sessionId);
    }

    LOG.debug('Waiting for data chunks ...');
    receivedDataAsString = '';
    
    response.on('data', chunk => {
        receivedDataAsString += chunk.toString();
        LOG.debug('Received ' + chunk.toString().length + ' byte(s).');
    });
    
    response.on('end', () => {
        LOG.debug('Received all data chunks (total: ' + receivedDataAsString.length + ' byte(s)).');
        if (messageContainer.isJsonRpcNotification) {
            resolve({sessionId: sessionId});
        }
        
        try {
            var jsonStart = receivedDataAsString.indexOf('{');
            var jsonEnd   = receivedDataAsString.lastIndexOf('}');

            if ((jsonStart >= 0) && (jsonEnd >= 0) && (jsonEnd > jsonStart)) {
                var extractedResponse = receivedDataAsString.substring(jsonStart, jsonEnd + 1);
                LOG.debug('Response: ' + extractedResponse);
                
                mcp.jsonrpc.processResponse(extractedResponse, messageContainer.message.id)
                    .then(data => resolve({sessionId: sessionId, data: data}))
                    .catch(reject);
            } else {
                reject({message: 'Cannot parse received message because it does not contain a stringified JSON object: ' + receivedDataAsString});
            }
        } catch(error) {
            reject({message: 'Failed to parse received message (' + error + '): ' + receivedDataAsString});
        }
    });
};

var sendToMcpServer = function sendToMcpServer(messageContainer, optionalSessionId) {
    return new Promise((resolve, reject) => {
        var stringifiedMessage = JSON.stringify(messageContainer.message);
        var options = {
            agent:    connectionAgent,
            protocol: mcpServerUrl.protocol,
            host:     mcpServerUrl.hostname,
            port:     mcpServerPort,
            path:     mcpServerUrl.pathname + mcpServerUrl.search,
            method:   'POST',
            headers: ['Host',           mcpServerUrl.hostname + ':' + mcpServerPort,
                      'Content-Type',   'application/json',
                      'Content-Length', stringifiedMessage.length,
                      'Accept',         'text/event-stream, application/json']
        };
        
        if (optionalSessionId !== undefined) {
            options.headers.push('MCP-Session-Id');
            options.headers.push(optionalSessionId);    
        }
        if (PERSONAL_ACCESS_TOKEN !== '') {
            options.headers.push('Authorization');
            options.headers.push('Bearer ' + PERSONAL_ACCESS_TOKEN);
        }
        
        var request = transportProtocol.request(options, httpResponseReceived.bind(undefined, messageContainer, resolve, reject));
        request.on('error', (e) => {
            reject({message: e});
        });

        try {
            request.write(stringifiedMessage, 'utf8');
        } catch(error) {
            reject({message: 'Failed to stringify message object: ' + error});
        }

        LOG.info('Sending ' + ((messageContainer.isJsonRpcNotification) ? 'notification' : 'request') + ': ' + stringifiedMessage);
        request.end();
    });
};

var sendInitializeRequest = function sendInitializeRequest() {
    return sendToMcpServer(messageFactory.createInitRequest());
};

var sendInitializedNotification = function sendInitializedNotification(resultOfPreviousCommand) {
    return sendToMcpServer(messageFactory.createInitializedNotification(), resultOfPreviousCommand.sessionId);
};

var sendListToolsRequest = function sendListToolsRequest(resultOfPreviousCommand) {
    return sendToMcpServer(messageFactory.createListToolsRequest(), resultOfPreviousCommand.sessionId);
};

var sendListResourcesRequest = function sendListResourcesRequest(resultOfPreviousCommand) {
    return sendToMcpServer(messageFactory.createListResourcesRequest(), resultOfPreviousCommand.sessionId);
};

var sendListPromptsRequest = function sendListPromptsRequest(resultOfPreviousCommand) {
    return sendToMcpServer(messageFactory.createListPromptsRequest(), resultOfPreviousCommand.sessionId);
};

var useTool = function useTool(args) {
    return resultOfPreviousCommand => {
        return sendToMcpServer(messageFactory.createRequest('tools/call', args), resultOfPreviousCommand.sessionId);
    };
};

var logTools = function logTools(resultOfPreviousCommand) {
    // jshint unused:false
    return new Promise((resolve, reject) => {
        var tools = ((resultOfPreviousCommand.data ?? {}).tools ?? []).map(tool => tool.name);
        LOG.info('Available tools: ' + JSON.stringify(tools));
        resolve({sessionId: resultOfPreviousCommand.sessionId});
    });
};

var readResource = function readResource(uri) {
    return resultOfPreviousCommand => {
        var args = {'uri': uri };
        return sendToMcpServer(messageFactory.createRequest('resources/read', args), resultOfPreviousCommand.sessionId);
    };
};

var getPrompt = function getPrompt(name, arguments) {
    return resultOfPreviousCommand => {
        var args = {'name': name, 'arguments': arguments};
        return sendToMcpServer(messageFactory.createRequest('prompts/get', args), resultOfPreviousCommand.sessionId);
    };
};

var logResult = function logResult(resultOfPreviousCommand) {
    // jshint unused:false
    return new Promise((resolve, reject) => {
        LOG.info('Result: ' + JSON.stringify(resultOfPreviousCommand.data));
        resolve({sessionId: resultOfPreviousCommand.sessionId});
    });
};


LOG.info('MCP server URL: ' + MCP_SERVER_URL);
if (PERSONAL_ACCESS_TOKEN !== '') {
    LOG.info('Using personal access token provided as environment variable.');
}

sendInitializeRequest()
    .then(sendInitializedNotification)
    .then(sendListToolsRequest)
    .then(logTools)
    .then(useTool({'name': 'add', 'arguments': {'a': 10, 'b': 20}}))
    .then(logResult)
    .then(sendListResourcesRequest)
    .then(readResource('data://config'))
    .then(logResult)
    .then(sendListPromptsRequest)
    .then(getPrompt('analyzeData', {'dataPoints': '[1, 2, 3]'}))
    .then(logResult)
    .catch(error => LOG.error('ERROR:' + JSON.stringify(error)));