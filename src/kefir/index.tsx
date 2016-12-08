import * as React from 'react';
import * as Kefir from 'kefir';
import {createEventHandlers} from '../common/createEventHandlers';
import {ComponentEvent} from '../common/ComponentEvent';


export interface KefirObservableComponent {
    (props: any): JSX.Element;
    __eventStream: any;
};

// observeComponent :: String[] -> Component -> ObservableComponent
export function observeComponent(...events: string[]): (Component: typeof React.Component) => KefirObservableComponent {
	return function observableComponentFactory(Component: typeof React.Component): KefirObservableComponent {
		const __eventPool = Kefir.pool();	

		function plugEvent(event: ComponentEvent): void {
			__eventPool.plug(Kefir.constant(event));
		}

		function HOC(props: any): JSX.Element {
			function createHandler(type: string): Function {
				return function handler(event: any) {
					props[type] && props[type](event);
					plugEvent(new ComponentEvent(type, event));
				};
			}
			const eventHandlers = createEventHandlers(events, createHandler);

			return (<Component {...props} {...eventHandlers} />);
		};
		
		(HOC as KefirObservableComponent).__eventStream = __eventPool.map((v) => v); // return Observable

		return (HOC as KefirObservableComponent);
	};
}

export {fromComponent} from '../common/fromComponent';
