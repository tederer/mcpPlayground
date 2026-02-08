require('./NamespaceUtils.js');

assertNamespace('mcp');

mcp.isFirstLogoutout = true;

mcp.Logger = function Logger(componentName, optionalLevelAsString) {
	var LEVEL         = {OFF: 0, ERROR: 1, WARNING: 2, INFO: 3, DEBUG: 4};
	var DEFAULT_LEVEL = LEVEL.INFO;
	
	var foundLevel       = Object.entries(LEVEL).find(entry => entry[0] === optionalLevelAsString.toUpperCase()) ?? [];
	var minLogLevel      = (foundLevel.length >= 0) ? LEVEL[foundLevel[0]] : DEFAULT_LEVEL;
	
	var currentTimestamp = function currentTimestamp() {
		return (new Date()).toISOString();
	};
	
	var levelName = function levelName(numericLevel) {
		return Object.entries(LEVEL)[numericLevel][0];
	};
	
	var log = function log(numericLevel, message) {
		if (numericLevel <= minLogLevel) {
			if (mcp.isFirstLogoutout) {
				console.log('timestamp;level;component;message');
				mcp.isFirstLogoutout = false;
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