import { configManagerObj } from '../util/ConfigManager';
import { commonAPI as app } from '../util/ExpressJSUtils.js';
import { outboundlogger, speedindexlogger, logger } from '../util/Logger.js';
import { commonCacheConfigObj } from '../util/CacheConfig.js';
import { resetMemory, fileMemorySize, freeUpMemorySpace, getCache, deleteCache, inMemorySize } from '../util/CacheManager';

const path = require('path');
const fs = require('fs');
var axiosLog = require('axios-debug-log');
var axiosLogging = function(params) {
	axiosLog({
		request: function(debug, config) {
			config.requestTime = new Date().getTime();
			config.param = params;
		},
		response: function(debug, response) {
			var now = new Date().getTime();
			var respTime = now - response.config.requestTime;
			outboundlogger.info(response.headers['content-type'] + ' ' + response.config.url + ' ' + response.status + ' ' + respTime + ' ' + params);
		},
		error: function(debug, error) {
			if(error.response) {
				var now = new Date().getTime();
				var respTime = now - error.response.config.requestTime;
				outboundlogger.info(error.response.headers['content-type'] + ' ' + error.response.config.url + ' ' + error.response.status + ' ' + respTime + ' ' + params);
			}
			logger.error(error);
		}
	});
};

axiosLogging('');

let CacheManager = require('../util/CacheManager.js');
var axiosCache = require('axios-debug-log');
var axiosCaching = function(params) {
	axiosCache({
		request: function(debug, request) {
			request.requestTime = new Date().getTime();
			request.param = params;
			if(request.cacheKey !== null && request.cacheKey !== undefined)				{
				CacheManager.getCache(request.cacheKey, function(res) {
					if(res) {
						request.cacheStatus='cached';
						/*					
						console.log(request.cacheKey+'-'+request.url);
						*/
        		// Set the request adapter to send the cached response and prevent the request from actually running
						request.adapter = () => {
							return Promise.resolve({
								data: res,
								status: request.status,
								statusText: request.statusText,
								headers: request.headers,
								config: request,
								request: request					
							});
						};					
					} else {
						return request;
					}
				});
			}
		},
		response: function(debug, response) {
			/*console.log('from response'+response.config.url);*/
			if(response.config.cacheStatus===undefined || response.config.cacheStatus ===null){
				var now = new Date().getTime();
				var respTime = now - response.config.requestTime;
				let charsetCheck = (response.headers && response.headers['content-type']) ? response.headers['content-type'].includes('charset') : false;
				if(!charsetCheck) {
					response.headers['content-type'] = response.headers['content-type'] + ';charset=UTF-8';
				}
				var elasticQueryingTime = '';
				if(response && response.data && response.data.took) {
					elasticQueryingTime =  response.data.took;
				}
				outboundlogger.info(response.headers['content-type'] + ' ' + response.config.url + ' ' + response.status + ' ' + respTime + ' ' + params + ' ' + elasticQueryingTime);				
				if(response.data !==undefined && response.data!==null && response.config.cacheKey !==null && response.config.cacheEnable ===true)			{
					CacheManager.setCache(response.config.cacheKey, JSON.stringify(response.data), response.config.cacheTtl, response.config.cacheEnable);
				}
			}
		},
		error: function(debug, error) {
			if(error.response) {
				var now = new Date().getTime();
				var respTime = now - error.response.config.requestTime;
				outboundlogger.info(error.response.headers['content-type'] + ' ' + error.response.config.url + ' ' + error.response.status + ' ' + respTime + ' ' + params);
			}
			logger.error(error);
		}
	});
};
axiosCaching('');

/**
 * Server health info
 * @param {object} req - The request made to server.
 * @param {object} res - The response returns from server to client
 */
const healthInfoUrl = '/reactuiboilerplate/v1/health';
app.get(healthInfoUrl, function(req, res) {
	var responseData = { 'status': 'UP', 'healthInfo': { 'status': 'UP', 'App Name': 'react-ui-boilerplate:v4' } };
	res.send(responseData);
});

/**
 * @swagger
 * /@applicationName@/v1/cache:
 *   delete:
 *     tags:
 *       - Cache
 *     description: Deletes the whole In-Memory and File System storage
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Deletes the whole In-Memory and File System storage
 */
let cacheUrl = '/'+configManagerObj.env_app_name+'/v1/cache';
app.delete(cacheUrl, (req, res) => {
	const response = { };
	resetMemory();
	response.message = 'Delete all cache entries successfully';
	setTimeout(function(){ 	
		response.cachesize = getFileCacheSize();
		res.status(200).json(response);		
	},200);
});

/**
 * @swagger
 * /@applicationName@/v1/cache/expired:
 *   delete:
 *     tags:
 *       - Cache
 *     description: Helps to delete all expired entries from file system
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Helps to delete all expired entries from file system
 */
app.delete(cacheUrl+'/expired', (req, res) => {
	const response = { 'data': {} };
	console.log("This is calling");
	freeUpMemorySpace();
	response.data = 'The file Caching memory has been reset successfully';	
	res.status(200).json(response);
});

/**
 * @swagger
 * /@applicationName@/v1/cache/{cachekey}:
 *   delete:
 *     tags:
 *       - Cache
 *     description: Deletes the Cache entry for the provided cache key
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cachekey
 *         description: Cache key
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Deletes the Cache entry for the provided cache key
 */
app.delete(cacheUrl+'/:cachekey', (req, res) => {
	const response = { };
	var cacheKey = req.params.cachekey;
	if(cacheKey) {
		deleteCache(cacheKey);
	}
	response.message = 'Cache key - '+ cacheKey +' has been delete successfully';	
	res.status(200).json(response);
});

/**
 * @swagger
 * /@applicationName@/v1/cache/size:
 *   get:
 *     tags:
 *       - Cache
 *     description: Returns size of the cached documents
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns size of the cached documents
 */
app.get(cacheUrl+'/size', (req, res) => {
	const resp = { };
	inMemorySize(function(response) {
		if(response) {
			var filesize = getFileCacheSize();
			var inMemorySize = getMemoryCacheSize(response);
			resp.diskCacheSize = filesize;
			resp.memoryCacheSize = inMemorySize;
			res.status(200).json(resp);
		}
	});
});

/**
 * @swagger
 * /@applicationName@/v1/cache/keys:
 *   get:
 *     tags:
 *       - Cache
 *     description: Gets the list of all cached keys
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Gets the list of all cached keys
 */
app.get(cacheUrl+'/keys', (req, res) => {
	const response = { 'cachedKeys': {} };
	const fileSizeJson = fileMemorySize();
	var cachesize = getFileCacheSize();
	response.cachedKeys.keys = Object.keys(fileSizeJson.collection);
	response.cachedKeys.cachesize = cachesize;
	res.status(200).json(response);	
});

/**
 * @swagger
 * /@applicationName@/v1/cache/{cachekey}:
 *   get:
 *     tags:
 *       - Cache
 *     description: Gets value for the provided cache key
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cachekey
 *         description: Cache key
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Gets value for the provided cache key
 */
app.get(cacheUrl+'/:cachekey', (req, res) => {
	const response = { 'cachedKeys': {} };
	var cacheKey = req.params.cachekey;
	if(cacheKey) {
		getCache(cacheKey, function(resp) {
			response.cachedKeys.key = cacheKey;
			response.cachedKeys.value = resp;
			res.status(200).json(response);
		});
	} else {
		response.cachedKeys.message = 'cachekey cannot be empty, request url example - /vpd/v1/cache/d_subHeadermobile';	
		res.status(200).json(response);
	}	
});

function getFileCacheSize() {
	const cachesize = { };
	const fileSizeJson = fileMemorySize();
	var currentSize = fileSizeJson.currentsize;
	var maxSize = fileSizeJson.options.maxsize;
	var availSize = maxSize - currentSize;
	cachesize.allocated = convertSize(maxSize);
	cachesize.used = convertSize(currentSize);
	cachesize.available = convertSize(availSize);
	return cachesize;
}

function getMemoryCacheSize(response) {
	const memorySize = { };
	var currentSize = response;
	var maxSize = commonCacheConfigObj.cacheMax.inMemory.maxsize;
	var availSize = maxSize - currentSize;
	memorySize.keyLength = maxSize + ' Keys';
	memorySize.usedKeys = currentSize+ ' Keys';
	return memorySize;
}

function convertSize(fileSize) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (fileSize == 0) return '0 Byte';
	var i = parseInt(Math.floor(Math.log(fileSize) / Math.log(1024)));
   	let convertedCacheSize = Math.round(fileSize / Math.pow(1024, i), 2) + ' ' + sizes[i];
	return convertedCacheSize;
}

app.get('/mock', (req, res) => {
	httpMock(req, res);
});

//const isMockServiceEnabled = configManagerObj.env_mock_service;

function httpMock(req, res) {
	let fileName = '../../../../config/env/local/mock-config.json';
	let jsonFilePath = path.join(__dirname, fileName);
	let mockFileobj = getFileResponseObj(jsonFilePath);
	jsonFilePath = path.join(__dirname, mockFileobj[req.query.url][req.query.type]);
	res.send(getFileResponseObj(jsonFilePath));
}

function getFileResponseObj(jsonFilePath) {
	let jsonObj;
	if (fs.existsSync(jsonFilePath)) {
		jsonObj = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
	}
	return jsonObj;
}

exports.commonAPI = app;
exports.axiosLogging = axiosLogging;
exports.axiosCaching = axiosCaching;
