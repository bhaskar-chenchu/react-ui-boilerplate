// dont delete the below function
const now = Date.now || (() => {
	return new Date().getTime();
});

const debounce = (func, wait, immediate, aargs) => {
	var timeout, args, timestamp, result;

	var later = function () {
		var last = now() - timestamp;

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			if (!immediate) {
				result = func(...aargs);
				if (!timeout) args = null;
			}
		}
	};

	return () => {
		args = aargs;
		timestamp = now();
		var callNow = immediate && !timeout;
		if (!timeout) timeout = setTimeout(later, wait);
		if (callNow) {
			result = func(...args);
			args = null;
		}

		return result;
	};
};

const getAllCookies = function(){
	return document.cookie;
	var pairs = document.cookie.split(';');
	var cookies = {};
	for (var i=0; i<pairs.length; i++){
		var pair = pairs[i].split('=');
		cookies[pair[0]] = unescape(pair[1]);
	}
	return cookies;
};

const deleteCookieByName = function(name){
	document.cookie = name + '=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/';
};

const getCookie = (cookiename) => {
	let cookiestring = RegExp('' + cookiename + '[^;]+').exec(document.cookie);
	return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '');
};

const setCookie = (cookieName,data) => {
	var curr_date = new Date();
	curr_date.setTime(curr_date.getTime() + (30 * 24 * 60 * 60 * 1000));
	document.cookie = cookieName+'='+data+ ';expires=' + curr_date + '; path=/; domain=.gaf.com;';
};

const getParamObject = ()=>{
	if (typeof window !== 'undefined') {
		let search = window && window.location && window.location.search.substring(1);
		if(search== ''){
			return {};
		}
		var urlQueryParams = {};
		decodeURI(search).replace(/([a-zA-Z0-9+]{1,})\=([a-zA-Z0-9+=/]{1,})/g,function(match,key,value){
			urlQueryParams[key] = value;
		});
		return urlQueryParams;
		//return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\//g, '\\') + '"}');
	}
	return {};
};

const getURLParam = (obj,negateEncode)=>{
	return (('?')+(Object.keys(obj).map(function(k) {
		if(negateEncode){
			return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
		}else{
			return k + '=' + obj[k];
		}

	}).join('&')));
};

const getAbsURL = (params)=>{
	if(params){
		return `${window.location.protocol}//${window.location.host}${window.location.pathname}${getURLParam(params)}`;
	}else{
		return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
	}
};

exports.getParamObject = getParamObject;
exports.getURLParam = getURLParam;
exports.getAbsURL = getAbsURL;
exports.getAllCookies = getAllCookies;
exports.deleteCookieByName = deleteCookieByName;
exports.getCookie = getCookie;
exports.setCookie = setCookie;
exports.debounce = debounce;
