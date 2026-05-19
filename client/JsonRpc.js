require('./NamespaceUtils.js');

assertNamespace('mcp.jsonrpc');

mcp.jsonrpc.processResponse = function processResponse(stringifiedJsonResponse, requestId) {
    return new Promise((resolve, reject) => {
        try {
            response = JSON.parse(stringifiedJsonResponse) ?? {};
            
            if (response.id !== requestId) {
                reject({message: 'JSON-RPC error: Response ID (' + response.id + ') does not match request ID (' + requestId + ').'});
            } else {
                if (response.result !== undefined) {
                    resolve(response.result);
                } else {
                    errorCode = (response.error ?? {}).code ?? 'n.a.';
                    errorMessage = (response.error ?? {}).message ?? 'No error message available in response.';
                    reject({message: 'JSON-RPC error: ' + errorMessage + ' (code:' + errorCode + ')'});
                }
            } 
        } catch(error) {
            reject({message: 'JSON-RPC error: Failed to parse received message (' + error + '): ' + stringifiedJsonResponse});
        }
    });
};