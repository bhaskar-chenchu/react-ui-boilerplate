var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
const { Given, Then, setDefaultTimeout } = require('cucumber');
chai.use(chaiAsPromised);
var expect = chai.expect;
var origFn = browser.driver.controlFlow().execute;

const BASE_URL = browser.params.baseURL;

/**
 * Create a web browser driver.
 * @param {object} driver - The driver value.
 * @return {object} The browser control.
 */
browser.driver.controlFlow().execute = function() {
	var args = arguments;
	origFn.call(browser.driver.controlFlow(), function() {
		return protractor.promise.delayed(3000);
	});
	return origFn.apply(browser.driver.controlFlow(), args);
};

setDefaultTimeout(60 * 3000);

Given('Customer opens Boilerplate page {string}', function(url) {
	return browser.get(BASE_URL + url);
});

Then('Customer sees the content in the page', function() {
	expect(element(by.css('.root-page')).isDisplayed()).to.eventually.be.true;
	return browser.driver.sleep(1000);
});
