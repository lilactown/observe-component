import React from 'react';
import {pool, constant} from 'kefir';

export function streamComponent(Component, events = []) {
	const __eventPool = new pool();	
	const eventHandlers = {};
	const plugEvent = (event) => __eventPool.plug(constant(event));

	function StreamableComponent(props) {
		events.forEach((type) => {
			eventHandlers[type] = (event) => {
				props[type] && props[type](event);
				plugEvent({ type, event });
			}
		});

		return (<Component {...props} {...eventHandlers} />);
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
