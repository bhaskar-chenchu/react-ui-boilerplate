import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import { configManagerObj } from '../../../util/ServerUtil';
import Root from'../components/app/root';

let appContext = '';
if (configManagerObj && configManagerObj.env_app_context) {
	appContext = '/' + configManagerObj.env_app_context;
}
const staticAssetsPath = appContext + '/v1/assets';

let loadPolyfillJS = (userAgent) => {
	let version = ((/msie\s|trident\/|edge\//i.test(userAgent))
		&& +(/(edge\/|rv:|msie\s)([\d.]+)/i.exec(userAgent)[2])) || '';
	return version && version<=12 ?
`<script src="${staticAssetsPath}/polyfill.min.js" type="text/javascript"></script>`:'';
};

export default class ComponentFactory {
	static getHTMLHead(styles, store) {
		return (`
            <!DOCTYPE html>
            <html lang="en">
                <head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0,
					minimum-scale=1.0, maximum-scale=2.0, user-scalable=0">
					<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
					<meta name = "format-detection" content = "telephone=no">
					<meta http-equiv="x-dns-prefetch-control" content="on">
					<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
					<title>React UI Boilerplate</title>
					<style>
						${styles}
					</style>
                </head>
                <body>
		`);
	};
	static getContentComponent(store) {
		let htmlString = renderToString(
			<Provider store={store}>
				<Root/>
			</Provider>
		);
		return `<div id="page-content">${htmlString}</div>`;
	}

	static getBottomContent(store, params) {
		let manifestContentClientJS = params.manifestContentClientJS;
		let userAgent = params.userAgent;
		let polyfill = loadPolyfillJS(userAgent);
		return (`	</div>
					<script>
						window.__APP_INITIAL_STATE__ = ${JSON.stringify(store.getState())};
					</script>
					${polyfill}
					<script src='${staticAssetsPath}/jquery.min.js' type="text/javascript" defer></script>
					<script src="${staticAssetsPath}/${manifestContentClientJS}" defer></script>
		      	</body>
		    </html>
		`);
	};
}
