var reporter = require('cucumber-html-reporter');

var options = {
	theme: 'bootstrap',
	jsonFile: 'test/unit/reports/json/results.json',
	output: 'test/unit/reports/status/index.html',
	reportSuiteAsScenarios: true,
	launchReport: true
};
reporter.generate(options);
