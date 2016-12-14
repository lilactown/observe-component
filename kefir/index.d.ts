/// <reference types="react" />
export interface ObservableComponent<P, O> extends React.StatelessComponent<P> {
    __eventStream: O;
}
export declare type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string;
export declare const observeComponent: <P>(...events: string[]) => (Component: Component) => ObservableComponent<P, any>;
export declare const fromComponent: (observableComponent: ObservableComponent<any, any>, ...filters: string[]) => any;
