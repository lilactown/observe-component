import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import assert from 'assert';
import Rx from 'rx';


describe('Rx (v4) module', function () {
	describe('observeComponent', function () {
		const observeComponent = require('../rx').observeComponent;
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

			ObservableComponent.__eventStream.subscribe((e) => 
				assert.deepEqual(e, { type: 'onClick', value: 'test event', props: {} }, "onClick")
			);
			result.props.onClick('test event');
		});

		it('should track multiple events when multiple event names are passed', function () {
			const ObservableComponent = observeComponent('onClick', 'onChange')('button');
			shallowRenderer.render(<ObservableComponent />);
			const result = shallowRenderer.getRenderOutput();

			ObservableComponent.__eventStream
				.filter((e) => e.type === "onClick")
				.subscribe((e) => 
					assert.deepEqual(e, { type: 'onClick', value: 'test event', props: {} }, "onClick")
				);
			ObservableComponent.__eventStream
				.filter((e) => e.type === "onChange")
				.subscribe((e) =>
					assert.deepEqual(e, { type: 'onChange', value: 'test event2', props: {} }, "onChange")
				);

			result.props.onClick('test event');
			result.props.onChange('test event2');
		});
	});

	describe('fromComponent', function () {
		const fromComponent = require('../rx').fromComponent;
		it('should return the __eventStream property set on an object', function () {
			const obj = {
				__eventStream: true
			};

			assert.strictEqual(fromComponent(obj), true, "__eventStream property");
		});

		it('if an array is supplied to the second argument, filter event names by members of array', function () {
			const __eventStream = Rx.Observable.create((observer) => {
				observer.onNext({type: 'onEvent1'});
				observer.onNext({type: 'onEvent2'});
				observer.onNext({type: 'onEvent2'});
				observer.onNext({type: 'onEvent3'});
				observer.onNext({type: 'onEvent4'});
				observer.onCompleted();
			});
			const obj = { __eventStream };

			const event2 = fromComponent(obj, 'onEvent2', 'onEvent3');
			let count = 0;
			event2.subscribe(({type}) => {
				// assert.strictEqual(type, 'onEvent2', "is onEvent2");
				count++;
			});
			assert.strictEqual(count, 3, "gets called three times");
		});
	});
});
