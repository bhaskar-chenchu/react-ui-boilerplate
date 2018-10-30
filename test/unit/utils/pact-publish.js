var pact = require('@pact-foundation/pact-node');
let pactBrokerURL = process.env.ENV_PACT_BROKER_URL;
var opts = {
	pactFilesOrDirs: ['test/unit/reports/pacts/'],
	pactBroker: pactBrokerURL,
	consumerVersion: '2.0.0'
	// pactBrokerUsername: 'admin',
	// pactBrokerPassword: 'password'
};

pact.publishPacts(opts).then(function () {
	console.log('********** Pact Published **********');
});
