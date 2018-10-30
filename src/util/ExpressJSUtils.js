const express = require('express');
const cluster = require('cluster');
const bodyParser = require('body-parser');
const compression = require('compression');
const https = require('https');
const fs = require('fs');
const path = require('path');
var rfs = require('rotating-file-stream');
import {logConfig,applicaitonName} from './LoggerConfig';
import { processlogger } from './Logger.js';
var morgan = require('morgan');
import {configManagerObj } from './ConfigManager';
import scheduleJob from './ScheduleJob';
import { getDiskCache, initilizingCache } from './CacheManager';

/**
 * ExpressJSUtils module.
 * @module ui/util/ExpressJSUtils
 */

getDiskCache();
initilizingCache();

const app = express();
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'Content-Type');
	next();
});

app.use(compression({threshold: 0}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
var logDirectory = logConfig.location;
var accessLogConf = logConfig.accessLogConfig;
var filename = accessLogConf.filename;
var accessLogStream = rfs(filename, {
	size: accessLogConf.maxsize,
	maxFiles: parseInt(accessLogConf.maxfiles),
	path: logDirectory
});

morgan.token('trueClientIP', function (req,res) {
	var trueClientIP = req.headers['True-Client-Ip'];
	var reqIP = req.ip;
	if(trueClientIP) {
		return trueClientIP;
	} else if (reqIP){
		return reqIP;
	} else {
		return '_';
	}

});
var logPattern = '[:date[clf]] :trueClientIP - ":method :url HTTP/:http-version" :method :status :res[content-length] "-" ":user-agent" :remote-addr :response-time[0] ":res[content-type]" :req[host] - -';
//var logPattern = '[:date[clf]] -  - ":method :url HTTP/:http-version" :method :status - "-" ":user-agent" "-" :url - -';
app.use(morgan(logPattern,{ 'stream': accessLogStream}));

var startServer = (expressApp, port, callback) => {
	if (cluster.isMaster) {
		const numCPUs = require('os').cpus().length;
		console.log('numCPUs : ', numCPUs);
		console.log(`Master ${process.pid} is running`);
		for (let i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
		cluster.on('exit', () => {
			processlogger.info( ' ' + process.pid + ' ');
			cluster.fork();
		});
	} else {
		if (process.env.ENV_SERVER === 'local' || process.env.ENV_ENABLE_HTTPS === 'true') {
			var securityKey = path.join(__dirname, '../../config/env/local/cert/server.key');
			var securityCert = path.join(__dirname, '../../config/env/local/cert/server.crt');
			var credentials = {
				key: fs.readFileSync(securityKey),
				cert: fs.readFileSync(securityCert),
			};
			https.createServer(credentials, expressApp).listen(port, function() {
				console.log(`Fork ${process.pid} is running in ${port} port`);
				callback();
			});
		} else {
			expressApp.listen(port, function() {
				console.log(`Fork ${process.pid} is running in ${port} port`);
				callback();
			});
		}
		scheduleJob(process.pid);
	}
};

//function initializeAccessLog () {


  // fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
  //
  // var logConfig = logger.accessLogConf;
  // var filename = logConfig.filename;
  // console.log("filename ",filename);
  // var accessLogStream = rfs(filename, {
  //   size: logConfig.maxsize,
  //   maxFiles: logConfig.maxfiles,
  //   path: logDirectory
  // })


/**
 * Represents express server.
 * @returns {object} - Return express server instance
 */
exports.commonAPI = app;
exports.startServer = startServer;
