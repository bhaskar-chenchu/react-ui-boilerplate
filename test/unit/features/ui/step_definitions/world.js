const { setWorldConstructor } = require('cucumber');

class CustomWorld {
	constructor() {
		this.response = {};
	}

	setTo(response) {
		this.response = response;
	}

}

setWorldConstructor(CustomWorld);