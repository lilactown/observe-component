import React from 'react';
import Rx from 'rx';
import {createEventHandlers} from '../common/createEventHandlers';
import {ComponentEvent} from '../common/componentEvent';

// observeComponent :: String[] -> Component -> ObservableComponent
export function observeComponent(...events) {
	return function observableComponentFactory(Component) {
		const __eventSubject = new Rx.Subject();	
		function onNext(event) {
			__eventSubject.onNext(event);
		}

		function ObservableComponent(props) {
			function createHandler(type) {
				return function handler(event) {
					props[type] && props[type](event);
					onNext(new ComponentEvent(type, event));
				};
			}
			const eventHandlers = createEventHandlers(events, createHandler);

			return (<Component {...props} {...eventHandlers} />);
		};
		
		ObservableComponent.__eventStream = __eventSubject.asObservable(); // return Observable

		return ObservableComponent;
	};
}

export {fromComponent} from '../common/fromComponent';
