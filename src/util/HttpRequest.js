import axios from 'axios';
import axiosCancel from 'axios-cancel';
import agent from 'agentkeepalive';
//var CircularJSON = require('circular-json');

const isMockServiceEnabled=false;

let keepaliveAgent = new agent({
  keepAlive:true 
});

let axiosConfigWithOutProxy = {
	timeout: 30000,
	headers: {'Content-Type': 'application/json; charset=utf-8'},
	agent : keepaliveAgent,
	withCredentials: true
};

let axiosConfigWithProxy = {
	timeout: 30000,
	headers: {'Content-Type': 'application/json; charset=utf-8'},
	proxy: {
		host: '172.28.97.25',
		port: 8080,
	},
	agent : keepaliveAgent,
	withCredentials: true
};


axiosCancel(axios, {
	debug: false // default 
});

const httpGet = (url, params, enableProxy, requestheaders, cacheConfig)=>{
	if(isMockServiceEnabled){
		return httpMock(url, params,'GET');
	}
	let config = enableProxy ? JSON.parse(JSON.stringify(axiosConfigWithProxy)) : JSON.parse(JSON.stringify(axiosConfigWithOutProxy));
	if(requestheaders !== undefined && requestheaders !=='') {
		config.headers.Cookie = requestheaders;
	}
	if(config){
		delete config.requestId;
	}
	if(params){
		if(params.requestFrom === 'server') {
			config.timeout = 5000;
			delete params.requestFrom;
		}
		if(params.cancelToken){
			config.requestId = params.cancelToken;
			delete params.cancelToken;
		}
		if(params.timeout){
			config.timeout = params.timeout;
			delete params.timeout;
		}
	}
	config = Object.assign({}, config, params, cacheConfig);
	return axios.get(url, config).then((response)=>{
		// eslint-disable-next-line no-console
		/*console.log('httpget-url-response', url,'----->',CircularJSON.stringify(response.data));*/
		return response;
	}).catch((error)=>{
		// eslint-disable-next-line no-console
		/*console.log('httpget-url-error', url,'----->',CircularJSON.stringify(error.message));*/
		console.log('Error message get = ' + error.message + 'url = ' + url);
		if (error.response) {
			return ({'error': true, 'message': 'Service response error, Please try again later.', 'type': 'ERROR', 'code': 1002, 'httpcode': error.response.status});
		} else if (error.request) {
			return ({'error': true, 'message': 'Service invalid request error, Please try again later.', 'type': 'ERROR', 'code': 1003});
		} else if(error.message.indexOf('timeout of') > -1 && error.message.indexOf('exceeded') > -1){
			return ({'error': true, 'message': 'Service timeout error, Please try again later.', 'type': 'ERROR', 'code': 1004});
		} else if(error.message.indexOf('cancelRequest') > -1){
			return ({'error': true, 'message': 'Service request canceled, Please try again later.', 'type': 'ERROR', 'code': 1001});
		}else{
			return ({'error': true, 'message': 'Service failure, Please try again later.', 'type': 'ERROR', 'code': 1000});	
		}
	});
};

const httpPost = (url, params, enableProxy, requestheaders, cacheConfig)=>{
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	if(isMockServiceEnabled){
		return httpMock(url, params,'POST');
	}
	let config = enableProxy ? JSON.parse(JSON.stringify(axiosConfigWithProxy)) : JSON.parse(JSON.stringify(axiosConfigWithOutProxy));
	if(requestheaders !== undefined  && requestheaders !=='') {
		config.headers.Cookie = requestheaders;
	}
	if(config){
		delete config.requestId;
	}
	if(params){
		if(params.requestFrom === 'server') {
			config.timeout = 5000;
			delete params.requestFrom;
		}
		if(params.cancelToken){
			config.requestId = params.cancelToken;
			delete params.cancelToken;
		}
		if(params.timeout){
			config.timeout = params.timeout;
			delete params.timeout;
		}
		if (params.responseType) {
			config.responseType = params.responseType;
			delete params.responseType;
		}
	}
	config = Object.assign({}, config, cacheConfig);
	return axios.post(url, params, config).then((response)=>{
		// eslint-disable-next-line no-console
		/*console.log('httppost-url-response', url,'----->',CircularJSON.stringify(response.data));*/
		return response;
	}).catch((error)=>{
		// eslint-disable-next-line no-console
		/*console.log('httppost-url-error', url,'----->',CircularJSON.stringify(error.message));*/
		console.log('Error message post = ' + error.message + 'url = ' + url);
		if (error.response) {
			return ({'error': true, 'message': 'Service response error, Please try again later.', 'type': 'ERROR', 'code': 1002, 'httpcode': error.response.status});
		} else if (error.request) {
			return ({'error': true, 'message': 'Service invalid request error, Please try again later.', 'type': 'ERROR', 'code': 1003});
		} else if(error.message.indexOf('timeout of') > -1 && error.message.indexOf('exceeded') > -1){
			return ({'error': true, 'message': 'Service timeout error, Please try again later.', 'type': 'ERROR', 'code': 1004});
		} else if(error.message.indexOf('cancelRequest') > -1){
			return ({'error': true, 'message': 'Service request canceled, Please try again later.', 'type': 'ERROR', 'code': 1001});
		}else{
			return ({'error': true, 'message': 'Service failure, Please try again later.', 'type': 'ERROR', 'code': 1000});	
		}
	});
};

const httpPut = (url, params, enableProxy, requestheaders)=>{
	if(isMockServiceEnabled){
		return httpMock(url, params,'PUT');
	}
	let config = enableProxy ? JSON.parse(JSON.stringify(axiosConfigWithProxy)) : JSON.parse(JSON.stringify(axiosConfigWithOutProxy));
	if(requestheaders !== undefined  && requestheaders !=='') {
		config.headers.Cookie = requestheaders;
	}
	if(config){
		delete config.requestId;
	}
	if(params){
		if(params.requestFrom === 'server') {
			config.timeout = 5000;
			delete params.requestFrom;
		}
		if(params.cancelToken){
			config.requestId = params.cancelToken;
			delete params.cancelToken;
		}
		if(params.timeout){
			config.timeout = params.timeout;
			delete params.timeout;
		}
	}
	return axios.put(url, params, config).then((response)=>{
		return response;
	}).catch((error)=>{
		console.log('Error message put = ' + error.message + 'url = ' + url);
		if (error.response) {
			return ({'error': true, 'message': 'Service response error, Please try again later.', 'type': 'ERROR', 'code': 1002, 'httpcode': error.response.status});
		} else if (error.request) {
			return ({'error': true, 'message': 'Service invalid request error, Please try again later.', 'type': 'ERROR', 'code': 1003});
		} else if(error.message.indexOf('timeout of') > -1 && error.message.indexOf('exceeded') > -1){
			return ({'error': true, 'message': 'Service timeout error, Please try again later.', 'type': 'ERROR', 'code': 1004});
		} else if(error.message.indexOf('cancelRequest') > -1){
			return ({'error': true, 'message': 'Service request canceled, Please try again later.', 'type': 'ERROR', 'code': 1001});
		}else{
			return ({'error': true, 'message': 'Service failure, Please try again later.', 'type': 'ERROR', 'code': 1000});	
		}
	});
};

const httpDelete = (url, params, enableProxy, requestheaders)=>{
	if(isMockServiceEnabled){
		return httpMock(url, params,'DELETE');
	}
	let config = enableProxy ? JSON.parse(JSON.stringify(axiosConfigWithProxy)) : JSON.parse(JSON.stringify(axiosConfigWithOutProxy));
	//config = enableProxy ? Object.assign({}, params, config) : params;
	if(requestheaders !== undefined  && requestheaders !=='') {
		config.headers.Cookie = requestheaders;
	}
	if(params){
		if(params.requestFrom === 'server') {
			config.timeout = 5000;
			delete params.requestFrom;
		}
	}
	if(config){
		delete config.requestId;
	}
	config = Object.assign({}, config, params);
	return axios.delete(url, config).then((response)=>{
		return response;
	}).catch((error)=>{
		console.log('Error message delete = ' + error.message + 'url = ' + url);
		if (error.response) {
			return ({'error': true, 'message': 'Service response error, Please try again later.', 'type': 'ERROR', 'code': 1002, 'httpcode': error.response.status});
		} else if (error.request) {
			return ({'error': true, 'message': 'Service invalid request error, Please try again later.', 'type': 'ERROR', 'code': 1003});
		} else if(error.message.indexOf('timeout of') > -1 && error.message.indexOf('exceeded') > -1){
			return ({'error': true, 'message': 'Service timeout error, Please try again later.', 'type': 'ERROR', 'code': 1004});
		} else if(error.message.indexOf('cancelRequest') > -1){
			return ({'error': true, 'message': 'Service request canceled, Please try again later.', 'type': 'ERROR', 'code': 1001});
		}else{
			return ({'error': true, 'message': 'Service failure, Please try again later.', 'type': 'ERROR', 'code': 1000});	
		}
	});
};

const httpMock=(url, params, type)=>{
	return axios.get('mock', {
		params: {
			url:url,
			params:params,
			type: type
		}
	}).then((response)=>{
		return response;
	}).catch((error)=>{
		return {'error': error};
	});
};

const httpStream = (url)=>{
	return axios({
  		method:'get',
  		url:url,
  		responseType:'stream'
	}).then(function(response) {
		return response;
	}).catch((error)=>{
		return {'error': error};
	});
};

const cancelAPICall = (token)=>{
	if(token){
		if(token === 'all'){
			axios.cancelAll();
		}else if(token.search(',')>-1){
			token = token.split(',');
			token.forEach((reqId) => {
				axios.cancel(reqId);
			});
		}else{
			axios.cancel(token);
		}
	}
};

const serverLocation = process.env.ENV_LOCATION;

exports.httpPost = httpPost;
exports.httpGet = httpGet;
exports.httpPut = httpPut;
exports.httpDelete = httpDelete;
exports.httpStream = httpStream;
exports.cancelAPICall = cancelAPICall;
exports.serverLocation = serverLocation;
