import React from 'react';
import Rx from 'rx';

class ComponentEvent {
	constructor(type, event) {
		this.type = type;
		this.event = event;
	}
}

export function observeComponent(Component, events = []) {
	const __eventSubject = new Rx.Subject();	
	const eventHandlers = {};
	const onNext = (event) => __eventSubject.onNext(event);

	function ObservableComponent(props) {
		events.forEach((type) => {
			eventHandlers[type] = (event) => {
				props[type] && props[type](event);
				onNext(new ComponentEvent(type, event));
			}
		});

		return (<Component {...props} {...eventHandlers} />);
	};
	
	ObservableComponent.__eventStream = __eventSubject.asObservable(); // return Observable

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
