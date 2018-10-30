import fs from 'fs';
import path from 'path';

import { configManagerObj } from './ConfigManager';

var logConfigFilePath = path.join(__dirname, '../../config/common/log-config.json');
var logLocation = configManagerObj.env_log_location;
var applicaitonName = configManagerObj.env_app_name;
var loggerConfigs = JSON.parse(fs.readFileSync(logConfigFilePath, 'utf8'));

if (!fs.existsSync(logLocation)) {
	// Create the directory if it does not exist
	fs.mkdirSync(logLocation);
}
let podHostName = process.env.HOSTNAME;
if (podHostName) {
	logLocation = logLocation + '/' + podHostName;
	if (!fs.existsSync(logLocation)) {
		fs.mkdirSync(logLocation);
	}
}
loggerConfigs.location = logLocation;

exports.logConfig = loggerConfigs;
