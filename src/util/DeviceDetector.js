import { configManagerObj } from './ConfigManager';
import { logger } from './Logger';

export default function deviceDetector(req) {
	var deviceType = req.headers[configManagerObj.env_akamai_device_type_lower] ? req.headers[configManagerObj.env_akamai_device_type_lower] : req.headers[configManagerObj.env_akamai_device_type_upper];
	var native = req.headers[configManagerObj.env_akamai_native_type_lower] ? req.headers[configManagerObj.env_akamai_native_type_lower] : req.headers[configManagerObj.env_akamai_native_type_upper];
	logger.debug("deviceType = ", deviceType);
	logger.debug("native = ", native);

	if(deviceType == null) {
		const MobileDetect = require('mobile-detect');
		var userAgent = req.headers['user-agent'];
		var md = new MobileDetect(userAgent);
		if(md.phone()) {
			deviceType = 'mobile';
		} else if (md.tablet()) {
			deviceType = 'tablet';
		} else {
			deviceType = 'desktop';
		}
	} else {
		if(deviceType === 'mobile' && native === 'YES') {
			deviceType = 'mobile-app'
		} else if (deviceType === 'tablet' && native === 'YES') {
			deviceType = 'tablet-app'
		}
	}
	return deviceType;
}
