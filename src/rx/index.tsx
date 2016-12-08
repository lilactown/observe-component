import * as React from 'react';
import * as Rx from 'rx';
import {createEventHandlers} from '../common/createEventHandlers';
import {ComponentEvent} from '../common/ComponentEvent';

export interface ObservableComponent<P> extends React.StatelessComponent<P> {
    __eventStream: Rx.Observable<ComponentEvent>;
};

export type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string
export type ComponentFactory<P> = (Component: Component) => Component;

// observeComponent :: String[] -> Component -> ObservableComponent
export function observeComponent<P>(...events: string[]): ComponentFactory<P> {
	return function observableComponentFactory(
		Component: Component
	): ObservableComponent<P> {
		const __eventSubject: Rx.Subject<any> = new Rx.Subject();
		function onNext(event: ComponentEvent) {
			__eventSubject.onNext(event);
		}

		function HOC(props: any): JSX.Element {
			function createHandler(type: string): (event) => void {
				return function handler(event: any) {
					props[type] && props[type](event);
					onNext(new ComponentEvent(type, event));
				};
			}
			const eventHandlers = createEventHandlers(events, createHandler);

			// return React.createElement(Component, {...props, ...eventHandlers})
			return (<Component {...props} {...eventHandlers} />);
		};
		
		(HOC as ObservableComponent<P>).__eventStream = __eventSubject.asObservable(); // return Observable

		return (HOC as ObservableComponent<P>);
	};
}

// fromComponent :: ObservableComponent -> String[] -> Observable
export function fromComponent(
	observableComponent: ObservableComponent<any>,
	...filters: string[]
): Rx.Observable<any> {
	if (filters && filters.length) {
		return observableComponent
			.__eventStream
			.filter(({ type }): boolean => filters.indexOf(type) > -1);
	}
	return observableComponent.__eventStream;
}
