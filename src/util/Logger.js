/**
 * Logger module.
 * @module ui/util/Logger
 */
var winston = require('winston');
var Rotate = require('winston-logrotate').Rotate;
const fs = require('fs');

import { logConfig } from './LoggerConfig';
import { configManagerObj } from './ConfigManager';

var dirName = logConfig.location;
winston.emitErrs = true;

var fileLogConfig = logConfig.fileLogConfig;
fileLogConfig.filename = dirName + '/' + fileLogConfig.filename;
fileLogConfig.level = configManagerObj.env_log_level;
var transports = [];
transports.push(new winston.transports.File(fileLogConfig));
if(logConfig.enableConsoleLog) {
	var consoleLogConfig = logConfig.consoleLogConfig;
	transports.push(new winston.transports.Console(consoleLogConfig));
}
var logger = new winston.Logger({
	transports: transports,
	exitOnError: false
});

var outboundAccessLogConfig = logConfig.outboundAccessLogConfig;
outboundAccessLogConfig.file = dirName + '/' + outboundAccessLogConfig.file;
var outBoundtransports = [];
outBoundtransports.push(new Rotate(outboundAccessLogConfig));
var outboundlogger = new winston.Logger({
	transports: outBoundtransports,
	exitOnError: false
});

var processLogConfig = logConfig.processLogConfig;
processLogConfig.file = dirName + '/' + processLogConfig.file;
var processtransports = [];
processtransports.push(new Rotate(processLogConfig));
var processlogger = new winston.Logger({
	transports: processtransports,
	exitOnError: false
});


var speedindexLogConfig = logConfig.speedindexLogConfig;
speedindexLogConfig.file = dirName + '/' + speedindexLogConfig.file;
var speedindextransports = [];
speedindextransports.push(new Rotate(speedindexLogConfig));
var speedindexlogger = new winston.Logger({
	transports: speedindextransports,
	exitOnError: false
});

/**
 * 
 * Represents logger.
 * @returns {object} - Return logger instance
 */
 exports.logger = logger;
 exports.outboundlogger = outboundlogger;
 exports.processlogger = processlogger;
 exports.speedindexlogger = speedindexlogger;
/**
 * Represents log info function in logger instance
 */
module.exports.stream = {
	write: function(message, encoding){
		logger.info(message);
	}
};
