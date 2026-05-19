require('./NamespaceUtils.js');

assertNamespace('mcp.jsonrpc.messages');

mcp.jsonrpc.messages.Factory = function Factory() {
	var currentId = 1;
	
	var nextId = function nextId() {
		return (currentId++);
	};
	
	var InitRequest = function InitRequest() {
		this.id       =	nextId();
		this.jsonrpc  =	'2.0';
		this.method   =	'initialize';
		this.params   =	{
			protocolVersion:	'2025-06-12',
			capabilities:		{},
			clientInfo:			{
				name:   'mcpTest',
				version:'0.0.1'
			}
		};
	};
	
	var InitializedNotification = function InitializedNotification() {
		this.jsonrpc = "2.0";
		this.method  = "notifications/initialized";
	};
	
	var Request = function Request(method, params) {
		this.id      = nextId();
		this.jsonrpc = '2.0';
		this.method  = method;
		if (params !== undefined) {
			this.params = params;
		}
	};
	
	this.createInitRequest = function createInitRequest() {
		return {isJsonRpcNotification: false, message: new InitRequest()};
	};

	this.createInitializedNotification = function createInitializedNotification() {
		return {isJsonRpcNotification: true, message: new InitializedNotification()};
	};

	this.createListToolsRequest = function createListToolsRequest() {
		return {isJsonRpcNotification: false, message: new Request('tools/list')};
	};

	this.createListResourcesRequest = function createListResourcesRequest() {
		return {isJsonRpcNotification: false, message: new Request('resources/list')};
	};

	this.createListPromptsRequest = function createListPromptsRequest() {
		return {isJsonRpcNotification: false, message: new Request('prompts/list')};
	};

	this.createRequest = function createRequest(method, params) {
		return {isJsonRpcNotification: false, message: new Request(method, params)};
	};
};