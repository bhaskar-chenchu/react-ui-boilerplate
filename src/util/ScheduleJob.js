var schedule = require('node-schedule');
import { freeUpMemorySpace } from './CacheManager';
import { cacheConfigObj } from './CacheConfig';
import { logger } from './Logger'


var scheduler; 
export default function scheduleJob(processID) {
	scheduler =  schedule.scheduleJob(cacheConfigObj.cacheSchedule.scheduleInterval, function(){
		logger.info('Started to delete expired cached files for the process Id '+ processID);
		freeUpMemorySpace();
		logger.info('Deleted cached files for the process Id '+ processID);
	});
	return scheduler;
}
