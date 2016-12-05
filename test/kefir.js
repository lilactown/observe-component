import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import assert from 'assert';
import K from 'kefir';

describe('Kefir module', function () {
	describe('observeComponent', function () {
		const observeComponent = require('../src/kefir').observeComponent;
		const shallowRenderer = createRenderer();

		it('should return a valid React component', function () {
			const ObservableComponent = observeComponent('onClick')('button');
			shallowRenderer.render(<ObservableComponent />);
			const result = shallowRenderer.getRenderOutput();

			assert.strictEqual(result.type, 'button', "is a button component");
		});

		it('should have an __eventStream property', function () {
			const ObservableComponent = observeComponent('onClick')('button');
			assert.strictEqual(!!ObservableComponent.__eventStream, true, "has __eventStream");
		});

		it('should have an onClick event handler', function () {
			const ObservableComponent = observeComponent('onClick')('button');
			shallowRenderer.render(<ObservableComponent />);
			const result = shallowRenderer.getRenderOutput();
			assert.strictEqual(!!result.props.onClick, true, "has onClick");
		});

		it('should emit a value on __eventStream when an event is triggered', function () {
			const ObservableComponent = observeComponent('onClick')('button');
			shallowRenderer.render(<ObservableComponent />);
			const result = shallowRenderer.getRenderOutput();

			ObservableComponent.__eventStream.onValue((e) => 
				assert.deepEqual(e, { type: 'onClick', value: 'test event' }, "onClick")
			);
			result.props.onClick('test event');
		});

		it('should track multiple events when multiple event names are passed', function () {
			const ObservableComponent = observeComponent('onClick', 'onChange')('button');
			shallowRenderer.render(<ObservableComponent />);
			const result = shallowRenderer.getRenderOutput();

			ObservableComponent.__eventStream
				.filter((e) => e.type === "onClick")
				.onValue((e) => 
					assert.deepEqual(e, { type: 'onClick', value: 'test event' }, "onClick")
				);
			ObservableComponent.__eventStream
				.filter((e) => e.type === "onChange")
				.onValue((e) =>
					assert.deepEqual(e, { type: 'onChange', value: 'test event2' }, "onChange")
				);

			result.props.onClick('test event');
			result.props.onChange('test event2');
		});
	});

	describe('fromComponent', function () {
		const fromComponent = require('../src/kefir').fromComponent;
		it('should return the __eventStream property set on an object', function () {
			const obj = {
				__eventStream: true
			};

			assert.strictEqual(fromComponent(obj), true, "__eventStream property");
		});

		it('if an array is supplied to the second argument, filter event names by members of array', function () {
			const __eventStream = K.stream((emitter) => {
				emitter.emit({type: 'onEvent1'});
				emitter.emit({type: 'onEvent2'});
				emitter.emit({type: 'onEvent2'});
				emitter.emit({type: 'onEvent3'});
				emitter.emit({type: 'onEvent4'});
				emitter.end();
			});
			const obj = { __eventStream };

			const event2 = fromComponent(obj, 'onEvent2', 'onEvent3');
			let count = 0;
			event2.onValue(({type}) => {
				// assert.strictEqual(type, 'onEvent2', "is onEvent2");
				count++;
			});
			assert.strictEqual(count, 3, "gets called three times");
		});
	});

});
