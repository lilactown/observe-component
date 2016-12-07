import * as React from 'react';
import {pool, constant} from 'kefir';
import {createEventHandlers} from '../common/createEventHandlers';
import {ComponentEvent} from '../common/componentEvent';

// observeComponent :: String[] -> Component -> ObservableComponent
export function observeComponent(...events) {
	return function observableComponentFactory(Component) {
		const __eventPool = new pool();	

		function plugEvent(event) {
			__eventPool.plug(constant(event));
		}

		function ObservableComponent(props) {
			function createHandler(type) {
				return function handler(event) {
					props[type] && props[type](event);
					plugEvent(new ComponentEvent(type, event));
				};
			}
			const eventHandlers = createEventHandlers(events, createHandler);
			return (<Component {...props} {...eventHandlers} />);
		};
		
		ObservableComponent.__eventStream = __eventPool.map((v) => v); // return Observable

		return ObservableComponent;
	};
}

export {fromComponent} from '../common/fromComponent';
