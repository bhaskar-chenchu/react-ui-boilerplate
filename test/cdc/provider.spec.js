const { Verifier } = require('@pact-foundation/pact');
const path = require('path');

let pactBrokerURL = process.env.ENV_PACT_BROKER_URL;
describe('Pact Verification', () => {
	it('should validate the expectations of Matching Service', function () { // lexical binding required here
		let opts = {
      		provider: 'reactuiboilerplate',
      		providerBaseUrl: 'https://localhost:8080',
      		// providerStatesSetupUrl: 'http://localhost:8081/setup',
			// Fetch pacts from broker
			pactBrokerUrl: pactBrokerURL,
			// Fetch from broker with given tags
			//tags: ['prod', 'sit5'],
			// Specific Remote pacts (doesn't need to be a broker)
			// pactUrls: ['http://localhost/pacts/provider/APIHealthCheckService'],
			// Local pacts
			// pactUrls: [path.resolve(process.cwd(), 'test/unit/reports/pacts/boilerplateapp-apihealthcheckservice.json')],
			// pactBrokerUsername: 'admin',
			// pactBrokerPassword: 'password',
			publishVerificationResult: true,
			providerVersion: '2.0.0',
			// customProviderHeaders: ['Authorization: basic e5e5e5e5e5e5e5']
		};

		return new Verifier().verifyProvider(opts)
		.then(output => {
			console.log('********** Pact Verification Complete! **********', output);
		});
	});
});
