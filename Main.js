var https   = require('node:https');
var Promise = require('promise');

require('./NamespaceUtils.js');
require('./Logger.js');
require('./JsonRpcMessageTemplates.js');


var LOG_LEVEL = 'debug';


var sendRequestToMcpServer = function sendRequestToMcpServer(message, httpAgent) {
    var LOG = new mcp.Logger('sendRequestToMcpServer', LOG_LEVEL);
    
    return new Promise((resolve, reject) => {
        var options = {
            agent:    httpAgent,
            protocol: 'https:',
            host:     'learn.microsoft.com',
            port:     443,
            path:     'https://learn.microsoft.com/api/mcp',
            method:   'POST',
            headers: ['Content-Type', 'application/json',
                      'Accept',       'application/json',
                      'Accept',       'text/event-stream']
        };
        
        var responseReceived = function responseReceived(response) {
            var receivedDataAsString = '';
            
            LOG.debug('Response received.');
            LOG.debug('Waiting for data chunks ...');
            
            response.on('data', chunk => {
                receivedDataAsString += chunk.toString();
                LOG.debug('Received ' + chunk.length + ' byte(s).');
            });
            
            response.on('end', () => {
                if (response.statusCode !== 200) {
                    reject({statusCode: response.statusCode, responseHeaders: response.headers, message: receivedDataAsString});
                    return;
                }
                
                LOG.debug('Received all data chunks (total: ' + receivedDataAsString.length + ' byte(s)).');
                try {
                    var jsonStart = receivedDataAsString.indexOf('{');
                    var jsonEnd   = receivedDataAsString.lastIndexOf('}');
                    if ((jsonStart >= 0) && (jsonEnd >= 0)) {
                        var responseAsJsonObject = JSON.parse(receivedDataAsString.substring(jsonStart, jsonEnd + 1));
                        var responseId           = (responseAsJsonObject ?? {}).id;
                        
                        if (responseId === message.id) {
                            resolve((responseAsJsonObject ?? {}).result);
                        } else {
                            reject({message: 'Response ID (' + responseId + ') does not match request ID (' + message.id + ').'});
                        }
                    } else {
                        reject({message: 'Cannot parse received message because it does not contain a stringified JSON object: ' + receivedDataAsString});
                    }
                } catch(error) {
                    reject({message: 'Failed to parse received message (' + error + '): ' + receivedDataAsString});
                }
            });
        };
        
        var request = https.request(options, responseReceived);
        request.on('error', (e) => {
            reject({message: e});
        });

        try {
            request.write(JSON.stringify(message), 'utf8');
        } catch(error) {
            reject({message: 'Failed to stringify message object: ' + error});
        }

        LOG.debug('Sending request to MCP server: ' + JSON.stringify(message));
        request.end();
    });
};


var httpAgent      = new https.Agent({ keepAlive: true });
var messageFactory = new mcp.messages.Factory();
var LOG            = new mcp.Logger('main', LOG_LEVEL);

var sendInitializedMessage = function sendInitializedMessage() {
    return sendRequestToMcpServer(messageFactory.createInitializedMessage(), httpAgent);
};

var sendListToolsMessage = function sendListToolsMessage() {
    return sendRequestToMcpServer(messageFactory.createListToolsMessage(), httpAgent);
};

var logResult = function logResult(result) {
    var tools = ((result ?? {}).tools ?? []).map(tool => tool.name);
    LOG.info('Available tools: ' + JSON.stringify(tools));
}

sendRequestToMcpServer(messageFactory.createInitMessage(), httpAgent)
    .then(sendInitializedMessage)
    .then(sendListToolsMessage)
    .then(logResult)
    .catch(error => LOG.error('ERROR:' + JSON.stringify(error)));