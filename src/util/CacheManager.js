import cacheManager from 'cache-manager';
import { cacheConfigObj } from './CacheConfig';
var path = require('path');
var fs = require('fs');

var diskCache = ''; 
var cache = '';
var memoryCache = '';
var appCacheConfigJson = null;
// var globalCacheEnabled = true;

// export function globalCacheEnable(value) {
// 	if(value === 'false') {
// 		value = false;
// 	}
// 	globalCacheEnabled = value;
// }

var isCacheableValue = function(value) {
	return value !== null && value !== false && value !== undefined;
};

export function getCache(key, callback='null') {
	cache.get(key, function(err, result) {
	 	if (err) { 
	 		return err; 
	 	} else {
			if(typeof callback!== 'function')			{
				return result;
			}else{
				callback(result); 
			}
	 	}
	});
}

export function setCache(key, value, ttl, enableCache) {
	if(ttl && enableCache) {
		cache.set(key, value, {ttl: ttl}, function(err) {
			if (err) { 
				throw err; 
			}
		});
	} else if(enableCache) {
		cache.set(key, value, function(err) {
			if (err) { 
				throw err; 
			}
		});
	}
}

export function deleteCache(key) {
	cache.del(key);
}

export function resetMemory() {
	diskCache.reset(function(err) {
		if(err) {
			throw err;
		}
	});
	cache.reset(function(err) {
		if(err) {
			throw err;
		}
	});
}

export function fileMemorySize(){
	var fileStoreVal = JSON.stringify(diskCache.store);
	return JSON.parse(fileStoreVal);
}

export function inMemorySize(callback='null') {
	memoryCache.keys(function(err, result) {
		if(err) {
			throw err;
		} else {
			if(typeof callback !== 'function') {
				return result.length;
			} else {
				callback(result.length); 
			}
		}	
	});	
}

export var getDiskCache = () => {
	return new Promise((resolve) => {
		var fsStore = require('./CacheFileStore');
		var diskPath = cacheConfigObj.cachePath.env_path;
		if(process.env.ENV_SERVER === 'local') {
			diskPath = cacheConfigObj.cachePath.local_path;
		} else if(process.env.ENV_SERVER === 'preview') {
			diskPath = cacheConfigObj.cachePath.preview_path;
		}
		if (!fs.existsSync(diskPath)) {
			fs.mkdirSync(diskPath);
		}
		diskCache = cacheManager.caching({
			store: fsStore,
			isCacheableValue: isCacheableValue,
			options: {
				maxsize: cacheConfigObj.cacheMax.diskcache.maxsize,
				path: diskPath,
				preventfill:cacheConfigObj.cachePreventfill.preventfill
			}
		});
	});
};

export function getMemoryCache(cacheManager, cacheConfigObj){
	return cacheManager.caching({store: 'memory', max: cacheConfigObj.cacheMax.inMemory.maxsize});
}

export function getMultiCache(cacheManager, cacheConfigObj, memoryCache, diskCache){
	return cacheManager.multiCaching([memoryCache, diskCache], { isCacheableValue: isCacheableValue });
}

export function initilizingCache() {
	memoryCache = getMemoryCache(cacheManager, cacheConfigObj);
	if(cacheConfigObj.cacheMode.option === 'memory') {
		cache = memoryCache;
	} else if (cacheConfigObj.cacheMode.option === 'disk') {
		cache =  diskCache;
	} else {
		cache =  getMultiCache(cacheManager, cacheConfigObj, memoryCache, diskCache);
	}	
}

export function freeUpMemorySpace(){
	var fileStoreString = '';
	if(typeof(diskCache) !== 'undefined') {
		var fileStoreVal = JSON.stringify(diskCache.store);
		fileStoreString = JSON.parse(fileStoreVal);
		for (var key in fileStoreString.collection){
			var cacheDetails = fileStoreString.collection[key];
			var expiryDate = cacheDetails.expires;
			var currentDate = new Date().getTime();
			if (expiryDate <= currentDate) {
		  		diskCache.del(key);
			}
		}
	}
}
