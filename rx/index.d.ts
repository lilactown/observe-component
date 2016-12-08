/// <reference types="react" />
import * as React from 'react';
import * as Rx from 'rx';
import { ComponentEvent } from '../common/ComponentEvent';
export interface ObservableComponent<P> extends React.StatelessComponent<P> {
    __eventStream: Rx.Observable<ComponentEvent>;
}
export declare type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string;
export declare type ComponentFactory<P> = (Component: Component) => ObservableComponent<P>;
export declare function observeComponent<P>(...events: string[]): ComponentFactory<P>;
export declare function fromComponent(observableComponent: ObservableComponent<any>, ...filters: string[]): Rx.Observable<any>;
