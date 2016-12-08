import * as React from 'react';
import * as Rx from 'rx';
import {createEventHandlers} from '../common/createEventHandlers';
import {ComponentEvent} from '../common/ComponentEvent';

export interface ObservableComponent {
    (props: any): JSX.Element;
    __eventStream: Rx.Observable<any>;
};

export type ComponentFactory = (Component: typeof React.Component) => ObservableComponent;

// observeComponent :: String[] -> Component -> ObservableComponent
export function observeComponent(...events: string[]): ComponentFactory {
	return function observableComponentFactory(Component: typeof React.Component): ObservableComponent {
		const __eventSubject: Rx.Subject<any> = new Rx.Subject();
		function onNext(event: ComponentEvent) {
			__eventSubject.onNext(event);
		}

		function HOC(props: any): JSX.Element {
			function createHandler(type: string): Function {
				return function handler(event: any) {
					props[type] && props[type](event);
					onNext(new ComponentEvent(type, event));
				};
			}
			const eventHandlers = createEventHandlers(events, createHandler);

			return (<Component {...props} {...eventHandlers} />);
		};
		
		(HOC as ObservableComponent).__eventStream = __eventSubject.asObservable(); // return Observable

		return (HOC as ObservableComponent);
	};
}

// fromComponent :: ObservableComponent -> String[] -> Observable
export function fromComponent(
	observableComponent: ObservableComponent,
	...filters: string[]
): Rx.Observable<any> {
	if (filters && filters.length) {
		return observableComponent
			.__eventStream
			.filter(({ type }): boolean => filters.indexOf(type) > -1);
	}
	return observableComponent.__eventStream;
}
