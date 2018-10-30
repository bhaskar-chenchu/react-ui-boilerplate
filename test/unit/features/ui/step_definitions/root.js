import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import jsdom from 'jsdom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { Given, Then, AfterAll, Before } from 'cucumber';
import path from 'path';
import fs from 'fs';
const { Pact } = require('@pact-foundation/pact');

import Root from '../../../../../src/ui/app/components/app/root.js';

const MOCK_SERVER_PORT = 8080;

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;

function readJsonFile(filePath) {
	return JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'));
}

// const provider = new Pact({
// 	consumer: 'reactuiboilerplate',
// 	provider: 'reactuiboilerplate',
// 	host: 'localhost',
// 	port: MOCK_SERVER_PORT,
// 	ssl: false,
// 	log: path.resolve(process.cwd(), 'logs', 'pact.log'),
// 	dir: path.resolve(process.cwd(), 'test/unit/reports/pacts'),
// 	logLevel: 'INFO',
// 	spec: 2
// });

// const EXPECTED_BODY = {'status': 'UP', 'appName': 'reactuiboilerplate'};

// Before(function(testCase, callback) {
// 	provider.setup()
// 	.then(() => {
// 		provider.addInteraction({
// 			state: 'V1 health check data',
// 			uponReceiving: 'a request for V1 health check data',
// 			withRequest: {
// 				method: 'GET',
// 				path: '/reactuiboilerplate/v1/health',
// 			},
// 			willRespondWith: {
// 				status: 200,
// 				body: EXPECTED_BODY
// 			}
// 		});
// 	})
// 	.then(() => callback());
// });

// AfterAll(function () {
// 	setTimeout(function() {
// 		provider.finalize();
// 	}, 4000);
// });

Given('Root component is available', function(callback) {
	let storeData = readJsonFile('../../../data/initial-data.json');
	store = mockStore(storeData);
	const renderComp = mount(
		<Provider store={store}>
			<Root />
		</Provider>
	);
	this.setTo(renderComp);
	callback();
});

Then('Welcome to boilerplate text shown', function(callback) {
	expect(this.response.find('.root-page').text()).to.equal('Welcome to Boilerplate');
	callback();
});
