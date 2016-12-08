import * as React from 'react';
import * as Rx from 'rx';
import {createEventHandlers} from '../common/createEventHandlers';
import {ComponentEvent} from '../common/ComponentEvent';

export interface RxObservableComponent {
    (props: any): JSX.Element;
    __eventStream: Rx.Observable<any>;
};

// observeComponent :: String[] -> Component -> ObservableComponent
export function observeComponent(...events: string[]): (Component: typeof React.Component) => RxObservableComponent {
	return function observableComponentFactory(Component: typeof React.Component): RxObservableComponent {
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
		
		(HOC as RxObservableComponent).__eventStream = __eventSubject.asObservable(); // return Observable

		return (HOC as RxObservableComponent);
	};
}

export {fromComponent} from '../common/fromComponent';
