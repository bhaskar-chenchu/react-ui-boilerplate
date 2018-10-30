import path from 'path';
import fs from 'fs';

import { deviceDetector, logger } from '../../../util/ServerUtil';
import { streamContent } from './ServerSidePageProcessor';
import { axiosCaching } from '../../../api/ServerEntry';

var mobileCSS = '';
var tabletCSS = '';
var desktopCSS = '';
var manifestContentClientJS = '';
var clientCSSContent = '';

var getDeviceSpecificCSS = () => {
	let commonCSSFilePath = path.join(__dirname, '../../../../dist/assets/common.css');
	let mobileCSSFilePath = path.join(__dirname, '../../../../dist/assets/mobile.css');
	let tabletCSSFilePath = path.join(__dirname, '../../../../dist/assets/tablet.css');
	let desktopCSSFilePath = path.join(__dirname, '../../../../dist/assets/desktop.css');

	if (fs.existsSync(commonCSSFilePath)) {
		var commonCSSContent = fs.readFileSync(commonCSSFilePath, 'utf8');
		mobileCSS += commonCSSContent;
		tabletCSS += commonCSSContent;
		desktopCSS += commonCSSContent;
	}
	if (fs.existsSync(mobileCSSFilePath)) {
		const mobileCSSContent = fs.readFileSync(mobileCSSFilePath, 'utf8');
		mobileCSS += mobileCSSContent;
	}
	if (fs.existsSync(tabletCSSFilePath)) {
		const tabletCSSContent = fs.readFileSync(tabletCSSFilePath, 'utf8');
		tabletCSS += tabletCSSContent;
	}
	if (fs.existsSync(desktopCSSFilePath)) {
		const desktopCSSContent = fs.readFileSync(desktopCSSFilePath, 'utf8');
		desktopCSS += desktopCSSContent;
	}
};

let getStaticAssets = () => {
	const manifestFilePath = path.join(__dirname, '../../../../dist/assets/manifest.json');
	if (fs.existsSync(manifestFilePath)) {
		let manifestContent = JSON.parse(fs.readFileSync(manifestFilePath, 'utf8'));
		manifestContentClientJS = manifestContent['client_bundle.js'];
	}
	getDeviceSpecificCSS();
};

exports.pageProcessor = function(req, res) {
	var device = deviceDetector(req);
	logger.debug('Req Host ' + req.headers.host + ' URL ' + req.url + ' Device Type ' + device);
	logger.info(' pageProcessor Device Type ..... ' + device);
	if (device === 'mobile' || device === 'mobile-app') {
		clientCSSContent = mobileCSS;
	} else if (device === 'tablet' || device === 'tablet-app') {
		clientCSSContent = tabletCSS;
	} else {
		clientCSSContent = desktopCSS;
	}

	let params = {
		clientCSSContent: clientCSSContent,
		manifestContentClientJS: manifestContentClientJS,
		deviceType:device
	};
	res.type('html');
	streamContent(req, res, params);
};

exports.serverStartupCallback = () => {
	axiosCaching('BPOutBoundResponse');
	getStaticAssets();
};
