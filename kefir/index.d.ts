/// <reference types="react" />
import * as React from 'react';
export interface ObservableComponent<P> extends React.StatelessComponent<P> {
    __eventStream: Rx.Observable<any>;
}
export declare type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string;
export declare type ComponentFactory<P> = (Component: Component) => ObservableComponent<P>;
export declare function observeComponent<P>(...events: string[]): ComponentFactory<P>;
export declare function fromComponent(observableComponent: ObservableComponent<any>, ...filters: string[]): any;
