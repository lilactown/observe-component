/// <reference types="react" />
import * as Rx from 'rx';
import { ComponentEvent } from '../common/ComponentEvent';
export interface ObservableComponent<P, O> extends React.StatelessComponent<P> {
    __eventStream: O;
}
export declare type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string;
export declare const observeComponent: <P>(...events: string[]) => (Component: Component) => ObservableComponent<P, Rx.Observable<ComponentEvent>>;
export declare const fromComponent: (observableComponent: ObservableComponent<any, Rx.Observable<ComponentEvent>>, ...filters: string[]) => Rx.Observable<ComponentEvent>;
