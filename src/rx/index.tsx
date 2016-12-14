import * as Rx from 'rx';
import { ComponentEvent } from '../common/ComponentEvent';
import { adaptObserveComponent, adaptFromComponent } from '../common/factories';

export interface ObservableComponent<P, O> extends React.StatelessComponent<P> {
    __eventStream: O;
}

export type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string

const adapter: AdapterDefinition<Rx.Subject<ComponentEvent>, Rx.Observable<ComponentEvent>> = {
	subjectFactory: () => new Rx.Subject<ComponentEvent>(),
	emit: (subject, v) => subject.onNext(v),
	toObservable: (subject) => subject.asObservable(),
	filter: (observable, predicate) => observable.filter(predicate),
};

export const observeComponent:
	<P>(...events: string[]) => (Component: Component) => ObservableComponent<P, Rx.Observable<ComponentEvent>> =
	adaptObserveComponent<Rx.Subject<ComponentEvent>, Rx.Observable<ComponentEvent>>(adapter);

export const fromComponent:
	(observableComponent: ObservableComponent<any, Rx.Observable<ComponentEvent>>, ...filters: string[]) => Rx.Observable<ComponentEvent> =
	adaptFromComponent(adapter);
