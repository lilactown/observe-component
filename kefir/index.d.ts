/// <reference types="react" />
import * as React from 'react';
export interface ObservableComponent {
    (props: any): JSX.Element;
    __eventStream: any;
}
export declare type ComponentFactory = (Component: typeof React.Component) => ObservableComponent;
export declare function observeComponent(...events: string[]): ComponentFactory;
export declare function fromComponent(observableComponent: ObservableComponent, ...filters: string[]): any;
