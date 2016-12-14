import * as React from 'react';
import {createEventHandlers} from './createEventHandlers';
import {ComponentEvent} from './ComponentEvent';

function getDisplayName(Component: Component) {
    if (typeof Component === "string") {
        return Component;
    }
    return Component.displayName;
}

export function adaptObserveComponent<Subject, Observable>(adapter: AdapterDefinition<Subject, Observable>) {
    return function observeComponent<P>(...events: string[]): (Component: Component) => ObservableComponent<P, Observable> {
        return function observableComponentFactory(
            Component: Component
        ): ObservableComponent<P, Observable> {
            const __eventSubject = adapter.subjectFactory();

            function HOC(props: any): JSX.Element {
                function createHandler(type: string): (event: any) => void {
                    return function handler(event: any) {
                        props[type] && props[type](event);
                        adapter.emit(__eventSubject, new ComponentEvent(type, event, props));
                    };
                }
                const eventHandlers = createEventHandlers(events, createHandler);

                // return React.createElement(Component, {...props, ...eventHandlers})
                return (<Component {...props} {...eventHandlers} />);
            };
            
            (HOC as ObservableComponent<P, Observable>).__eventStream = adapter.toObservable(__eventSubject); // return Observable
            (HOC as ObservableComponent<P, Observable>).displayName = `Observable(${getDisplayName(Component)})`;

            return (HOC as ObservableComponent<P, Observable>);
        };
    };
}

export function adaptFromComponent<Subject, Observable>(adapter: AdapterDefinition<Subject, Observable>) {
    return function fromComponent(
        observableComponent: ObservableComponent<any, Observable>,
        ...filters: string[]
    ): Observable {
        if (filters && filters.length) {
            return adapter.filter(
                observableComponent.__eventStream,
                ({ type }) => filters.indexOf(type) > -1
            );
        }
        return observableComponent.__eventStream;
    };
}
