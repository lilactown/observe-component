import * as React from 'react';
import * as Kefir from 'kefir';
import {createEventHandlers} from '../common/createEventHandlers';
import {ComponentEvent} from '../common/ComponentEvent';

export interface ObservableComponent<P> extends React.StatelessComponent<P> {
    __eventStream: Rx.Observable<any>;
};

export type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string;
export type ComponentFactory<P> = (Component: Component) => ObservableComponent<P>;

// observeComponent :: String[] -> Component -> ObservableComponent
export function observeComponent<P>(...events: string[]): ComponentFactory<P> {
	return function observableComponentFactory(
		Component: Component
	): ObservableComponent<P> {
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
		
		(HOC as ObservableComponent<P>).__eventStream = __eventPool.map((v) => v); // return Observable

		return (HOC as ObservableComponent<P>);
	};
}

// fromComponent :: ObservableComponent -> String[] -> Observable
export function fromComponent(
	observableComponent: ObservableComponent<any>,
	...filters: string[]
	): any {
	if (filters && filters.length) {
		return observableComponent
			.__eventStream
			.filter(({ type }): boolean => filters.indexOf(type) > -1);
	}
	return observableComponent.__eventStream;
}
