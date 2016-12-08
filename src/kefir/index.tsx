import * as React from 'react';
import * as Kefir from 'kefir';
import {createEventHandlers} from '../common/createEventHandlers';
import {ComponentEvent} from '../common/ComponentEvent';


export interface ObservableComponent {
    (props: any): JSX.Element;
    __eventStream: any;
};

export type ComponentFactory = (Component: typeof React.Component) => ObservableComponent;

// observeComponent :: String[] -> Component -> ObservableComponent
export function observeComponent(...events: string[]): ComponentFactory {
	return function observableComponentFactory(Component: typeof React.Component): ObservableComponent {
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
		
		(HOC as ObservableComponent).__eventStream = __eventPool.map((v) => v); // return Observable

		return (HOC as ObservableComponent);
	};
}

// fromComponent :: ObservableComponent -> String[] -> Observable
export function fromComponent(
	observableComponent: ObservableComponent,
	...filters: string[]
	): any {
	if (filters && filters.length) {
		return observableComponent
			.__eventStream
			.filter(({ type }): boolean => filters.indexOf(type) > -1);
	}
	return observableComponent.__eventStream;
}
