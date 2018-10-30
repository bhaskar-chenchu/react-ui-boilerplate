var path = require('path');
var fs = require('fs');

var cacheFilePath = path.join(__dirname, '../../../../config/common/cache-config.json');
var cacheConfig = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));

exports.cacheConfigObj = cacheConfig;
