import React from 'react';
import {pool, constant} from 'kefir';

class ComponentEvent {
	constructor(type, event) {
		this.type = type;
		this.event = event;
	}
}

export function observeComponent(Component, events = []) {
	const __eventPool = new pool();	
	const eventHandlers = {};
	const plugEvent = (event) => __eventPool.plug(constant(event));

	function ObservableComponent(props) {
		events.forEach((type) => {
			eventHandlers[type] = (event) => {
				props[type] && props[type](event);
				plugEvent(new ComponentEvent(type, event));
			}
		});

		return (<Component {...props} {...eventHandlers} />);
	};
	
	ObservableComponent.__eventStream = __eventPool.map((v) => v); // return Observable

	return ObservableComponent;
}

export function fromComponent(ObservableComponent, filters) {
	if (filters && filters.length) {
		return ObservableComponent
			.__eventStream
			.filter(({type}) => filters.indexOf(type) > -1)
	}
	return ObservableComponent.__eventStream;
}
