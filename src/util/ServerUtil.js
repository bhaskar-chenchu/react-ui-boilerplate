import deviceDetector from './DeviceDetector';
import {commonAPI, startServer} from './ExpressJSUtils';
import {logger} from './Logger';
import {configManagerObj} from './ConfigManager';
import {commonCacheConfigObj} from './CacheConfig';

export {
	configManagerObj,
	deviceDetector,
	commonAPI,
	startServer,
	logger,
	commonCacheConfigObj
};
