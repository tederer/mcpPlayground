require('./NamespaceUtils.js');

assertNamespace('mcp.messages');

mcp.messages.Factory = function Factory() {
	var currentId = 1;
	
	var nextId = function nextId() {
		return (currentId++);
	};
	
	var InitMessage = function InitMessage() {
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
	
	var InitializedMessage = function InitializedMessage() {
		this.id      = nextId();
		this.jsonrpc = "2.0";
		this.method  = "notifications/initialized";
	};
	
	var ListToolsMessage = function ListToolsMessage() {
		this.id      = nextId();
		this.jsonrpc = '2.0';
		this.method  = 'tools/list';
	};
	
	this.createInitMessage = function createInitMessage() {
		return new InitMessage();
	};

	this.createInitializedMessage = function createInitializedMessage() {
		return new InitializedMessage();
	};

	this.createListToolsMessage = function createListToolsMessage() {
		return new ListToolsMessage();
	};
};