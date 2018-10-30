let functionalTestURL = process.env.ENV_FUNCTIONAL_TEST_URL;
exports.config = {
	directConnect: true,
	getPageTimeout: 9000,
	allScriptsTimeout: 9000,
	framework: 'custom',
	frameworkPath: require.resolve('../../node_modules/protractor-cucumber-framework'),
	ignoreUncaughtExceptions: true,
	capabilities: {
		'browserName': 'chrome',
		'acceptInsecureCerts' : true,
		'chromeOptions': {
			'args': ['--disable-web-security', '--headless', '--disable-gpu', '--window-size=1280,1024', 'no-sandbox']
		}
	},
	onPrepare: function() {
		browser.ignoreSynchronization = true;
	},
	params: {
		baseURL: functionalTestURL
	},
	specs: ['features/*.feature'],
	cucumberOpts: {
		format: ['json:test/functional/reports/json/results.json'],
		require: ['features/step_definitions/*.js'],
		tags: false,        
		profile: false,
		'no-source': true,
		keepAlive: false,
		strict: true
	}
}; 
