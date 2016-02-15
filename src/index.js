import React from 'react';
import {pool, constant} from 'kefir';

export function streamComponent(Component, events = []) {
	const __eventPool = new pool();
	const eventEmitters = {};
	
	const plugEvent = (e) => __eventPool.plug(constant(e));

	function StreamableComponent(props) {
		const map = props.map || function (o) { return o; };
		events.forEach((event) => {
			eventEmitters[event] = (e) => {
				props[event] && props[event](e);
				plugEvent(map({ event, e }));
			}
		});

		return (<Component {...props} {...eventEmitters} />);
	};
	
	StreamableComponent.__eventStream = __eventPool.map((v) => v); // return Observable

	return StreamableComponent;
}

export function getStream(StreamableComponent) {
	return StreamableComponent.__eventStream;
}
