import React from 'react';
import {pool, constant} from 'kefir';

export function streamComponent(Component, events = []) {
	const __eventPool = new pool();
	const eventEmitters = {};
	
	const plugEvent = (event) => __eventPool.plug(constant(event));

	function StreamableComponent(props) {
		const map = props.map || function (o) { return o; };
		events.forEach((type) => {
			eventEmitters[type] = (event) => {
				props[type] && props[type](event);
				plugEvent(map({ type, event }));
			}
		});

		return (<Component {...props} {...eventEmitters} />);
	};
	
	StreamableComponent.__eventStream = __eventPool.map((v) => v); // return Observable

	return StreamableComponent;
}

export function fromComponent(StreamableComponent, filters) {
	if (filters && filters.length) {
		return StreamableComponent
			.__eventStream
			.filter(({type}) => filters.indexOf(type) > -1)
	}
	return StreamableComponent.__eventStream;
}
