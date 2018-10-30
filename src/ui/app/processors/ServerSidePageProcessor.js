import async from 'async';

import { logger, configManagerObj } from '../../../util/ServerUtil';
import createStoreWithInitialState from '../store';
import ComponentFactory from '../factory/ComponentFactory';

let clientConfigManagerObj = Object.assign({}, configManagerObj, {});

let streamHTMLHead = (store, req, res, clientCSSContent) => {
	return new Promise(function (resolve) {
		let storeState = store.getState();
		let { envConfig } = storeState;
		let htmlHeadStr = ComponentFactory.getHTMLHead(clientCSSContent, store);
		res.write(htmlHeadStr);
		resolve();
	});
};

let streamComponent = (store, res) => {
	return new Promise(function (resolve) {
		res.write(ComponentFactory.getContentComponent(store));
		resolve();
	});
};

let getUserAgent = (req) => {
	return req.headers['user-agent'] || '';
};

let streamPageBottomContent = (req, res, store, params) => {
	let userAgent = getUserAgent(req);
	let paramObj = {
		manifestContentClientJS: params.manifestContentClientJS,
		userAgent: userAgent
	};
	return new Promise(function (resolve) {
		res.end(ComponentFactory.getBottomContent(store, paramObj));
		resolve();
	});
};

exports.streamContent = function (req, res, params) {
	let clientCSSContent = params.clientCSSContent;
	let manifestContentClientJS = params.manifestContentClientJS;
	let initialData = {
		'device': params.deviceType
	};
	clientConfigManagerObj = Object.assign({}, clientConfigManagerObj, initialData);
	let initialState = {'envConfig': clientConfigManagerObj };
	let store = createStoreWithInitialState(initialState);
	logger.info('Initial Entry - ' + Date.now());
	streamHTMLHead(store, req, res, clientCSSContent)
		.then(function () {
			logger.info('streamComponent Entry - ' + Date.now());
			return streamComponent(store, res);
		})
		.then(function () {
			logger.info('streamPageBottomContent Entry - ' + Date.now());
			let params = {};
			params.manifestContentClientJS = manifestContentClientJS;
			return streamPageBottomContent(req, res, store, params);
		})
		.catch((error) => {
			logger.error('Stream error : ', error);
		});
};
