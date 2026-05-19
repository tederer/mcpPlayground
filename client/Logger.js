require('./NamespaceUtils.js');

assertNamespace('mcp');


var LoggingSystem = function LoggingSystem() {
	var LEVEL            = {OFF: 0, ERROR: 1, WARNING: 2, INFO: 3, DEBUG: 4};
	var minLogLevel      = LEVEL.INFO;
	var isFirstLogoutout = true;

	var Logger = function Logger(componentName) {
		var currentTimestamp = function currentTimestamp() {
			return (new Date()).toISOString();
		};
		
		var levelName = function levelName(numericLevel) {
			return Object.entries(LEVEL)[numericLevel][0];
		};
		
		var log = function log(numericLevel, message) {
			if (numericLevel <= minLogLevel) {
				if (isFirstLogoutout) {
					console.log('timestamp;level;component;message');
					isFirstLogoutout = false;
				}
				console.log(currentTimestamp() + ';' + levelName(numericLevel) + ';' + componentName + ';' + message);
			}
		};
		
		this.error = function error(message) {
			log(LEVEL.ERROR, message);
		};	
		
		this.warning = function warning(message) {
			log(LEVEL.WARNING, message);
		};	
		
		this.info = function info(message) {
			log(LEVEL.INFO, message);
		};
		
		this.debug = function debug(message) {
			log(LEVEL.DEBUG, message);
		};	
	};

	this.setLevel = function setLevel(newLevel) {
		var foundLevel  = Object.entries(LEVEL).find(entry => entry[0] === newLevel.toUpperCase()) ?? [];
		if (foundLevel.length >= 0) {
			minLogLevel = LEVEL[foundLevel[0]];
		}
	};

	this.createLogger = function createLogger(componentName) {
		return new Logger(componentName);
	};
};

mcp.LoggingSystem = new LoggingSystem();
