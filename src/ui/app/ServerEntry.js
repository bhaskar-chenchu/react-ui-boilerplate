import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

import { startServer, configManagerObj} from '../../util/ServerUtil';
import { pageProcessor, serverStartupCallback } from './processors/PageProcessor';
import { commonAPI as app } from '../../api/ServerEntry';

let appContext = '';
if (configManagerObj && configManagerObj.env_app_context) {
	appContext = '/' + configManagerObj.env_app_context;
}

var distDir = path.join(__dirname, '../../../dist/assets');
let staticAssetsPath = appContext + '/v1/assets';

app.use(staticAssetsPath, express.static(distDir));
app.use(cookieParser());

const PORT = configManagerObj.env_config_server_port;

let pageURL = appContext + '/v1/page';
app.get(pageURL, (req, res) => {
	pageProcessor(req, res);
});

startServer(app, PORT, function() {
	serverStartupCallback();
});

if(process.env.NODE_ENV === 'test') {
	module.exports = app;
}
