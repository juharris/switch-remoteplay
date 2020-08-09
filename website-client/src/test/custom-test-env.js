const Environment = require('jest-environment-jsdom');

// Modified https://github.com/microsoft/0xDeCA10B/blob/master/demo/client/test/custom-test-env.js

/**
 * A custom environment to set up globals for tests.
 */
module.exports = class CustomTestEnvironment extends Environment {
	async setup() {
		await super.setup();
		if (typeof this.global.indexedDB === 'undefined') {
			this.global.indexedDB = require('fake-indexeddb');
		}
		if (typeof this.global.IDBKeyRange === 'undefined') {
			this.global.IDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange")
		}
	}
}
