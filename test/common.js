import assert from 'assert';

describe('common functions and classes across libraries', function () {
	describe('createEventHandlers', function () {
		const {createEventHandlers} = require('../src/common/createEventHandlers');
		it('should take an array of event names and a function and execute the function for each event', function () {

		});
		it('should output a generated object', function () {
			const handlerFn = (type) => type;
			assert.deepEqual(
				createEventHandlers(['onClick'], handlerFn),
				{ onClick: 'onClick' }
			);
		});
	});
});