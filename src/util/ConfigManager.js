import path from 'path';
import fs from 'fs';
import async from 'async';
import yaml from 'js-yaml';
import _ from 'underscore';

const envServer = process.env.ENV_SERVER;
const envConfigFilePath = process.env.ENV_CONFIG_FILE_PATH;

var configObj = null;
var matchRegex = /(\${.*?\})/g;
try {
	async.parallel({
		moduleConfig: function(callback) {
			let appConfigFile = '../../config/app-config.json';
			let envConfigFile = '';
			if (envServer) {
				envConfigFile = '../../config/env/' + envServer + '/config.yaml';
			} else {
				envConfigFile = envConfigFilePath + '/app/config.yaml';
			}
			getConfigObj(appConfigFile, envConfigFile, function(config) {
				callback(null, config);
			});
		}
	}, function(err, results) {
		configObj = Object.assign({}, results.moduleConfig);
	});

	function getConfigObj(appConfigFile, envConfigFile, callback) {
		let appConfigFilePath = path.join(__dirname, appConfigFile);
		if (fs.existsSync(appConfigFilePath)) {
			let appConfig = fs.readFileSync(appConfigFilePath, 'utf8');
			let parameterizedProps = _.uniq(appConfig.match(matchRegex));
			if (envServer) {
				envConfigFile = path.join(__dirname, envConfigFile);
			}
			let envConfig = null;
			if (fs.existsSync(envConfigFile)) {
				let yamlContent = fs.readFileSync(envConfigFile, 'utf8');
				if (envServer) {
					yamlContent = yaml.load(yamlContent).data['config.yaml'];
				}
				envConfig = yaml.load(yamlContent);
				getENVConfig(envConfig, function(updatedEnvConfig) {
					async.each(parameterizedProps, function(value, callbackFunction) {
						var envProp = value.substring(2, value.length - 1);
						let envConfigValue = updatedEnvConfig[envProp];
						if (envConfigValue === undefined) {
							envConfigValue = process.env[envProp];
						}
						if (envConfigValue || envConfigValue !== undefined) {
							if (typeof(envConfigValue) === 'boolean' || typeof(envConfigValue) === 'number') {
							// if (typeof(envConfigValue) === 'boolean') {
								value = '"' + value + '"';
							}
							var replaceRegex = new RegExp(value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"), 'g');
							appConfig = appConfig.replace(replaceRegex, envConfigValue);
						}
						callbackFunction();
					}, function(err) {
						callback(JSON.parse(appConfig));
					});
				});
			}
		}
	};
	function getENVConfig(envConfig, callback) {
		let stringifiedEnvConfig = JSON.stringify(envConfig);
		let yamlParameterizedProps = _.uniq(stringifiedEnvConfig.match(matchRegex));
		if (_.isEmpty(yamlParameterizedProps)) {
			return callback(envConfig);
		}
		async.each(yamlParameterizedProps, function(value, callbackFunction) {
			var envProp = value.substring(2, value.length - 1);
			let envConfigValue = process.env[envProp];
			if (envConfigValue || envConfigValue !== undefined) {
				if (typeof(envConfigValue) === 'boolean' || typeof(envConfigValue) === 'number') {
				// if (typeof(envConfigValue) === 'boolean') {
					value = '"' + value + '"';
				}
				var replaceRegex = new RegExp(value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"), 'g');
				stringifiedEnvConfig = stringifiedEnvConfig.replace(replaceRegex, envConfigValue);
			}
			callbackFunction();
		}, function(err) {
			callback(yaml.load(stringifiedEnvConfig));
		});
	}
} catch (error) {
	console.log('Config Manager error : ', error);
}

exports.configManagerObj = configObj;
