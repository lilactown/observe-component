import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import assert from 'assert';

describe('streamComponent', function () {
	const streamComponent = require('../src').streamComponent;
	const shallowRenderer = createRenderer();

	it('should return a valid React component', function () {
		const Streamable = streamComponent('button', ['onClick']);
		shallowRenderer.render(<Streamable />);
		const result = shallowRenderer.getRenderOutput();

		assert.strictEqual(result.type, 'button', "is a button component");
	});

	it('should have an __eventStream property', function () {
		const Streamable = streamComponent('button', ['onClick']);
		assert.strictEqual(!!Streamable.__eventStream, true, "has __eventStream");
	});

	it('should have an onClick event handler', function () {
		const Streamable = streamComponent('button', ['onClick']);
		shallowRenderer.render(<Streamable />);
		const result = shallowRenderer.getRenderOutput();
		assert.strictEqual(!!result.props.onClick, true, "has onClick");
	});

	it('should emit a value on __eventStream when an event is triggered', function () {
		const Streamable = streamComponent('button', ['onClick']);
		shallowRenderer.render(<Streamable />);
		const result = shallowRenderer.getRenderOutput();

		Streamable.__eventStream.onValue((e) => 
			assert.deepEqual(e, { event: 'onClick', e: 'test event' }, "onClick")
		);
		result.props.onClick('test event');
	});
});

describe('getStream', function () {
	const getStream = require('../src').getStream;
	it('should return the __eventStream property set on an object', function () {
		const obj = {
			__eventStream: true
		};

		assert.strictEqual(getStream(obj), true, "__eventStream property");
	});
});
