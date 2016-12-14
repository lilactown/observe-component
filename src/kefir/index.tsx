import * as Kefir from 'kefir';
import { ComponentEvent } from '../common/ComponentEvent';
import { adaptObserveComponent, adaptFromComponent } from '../common/factories';

export interface ObservableComponent<P, O> extends React.StatelessComponent<P> {
    __eventStream: O;
}

export type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string

const adapter: AdapterDefinition<any, any> = {
	subjectFactory: () => Kefir.pool(),
	emit: (pool, v) => pool.plug(v),
	toObservable: (pool) => pool.map((v) => v),
	filter: (observable, predicate) => observable.filter(predicate),
};

export const observeComponent:
	<P>(...events: string[]) => (Component: Component) => ObservableComponent<P, any> =
	adaptObserveComponent<any, any>(adapter);

export const fromComponent:
	(observableComponent: ObservableComponent<any, any>, ...filters: string[]) => any =
	adaptFromComponent(adapter);
