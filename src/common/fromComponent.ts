import * as Kefir from 'kefir';
import { KefirObservableComponent } from '../kefir';
import { RxObservableComponent } from '../rx';

type ObservableComponent = KefirObservableComponent | RxObservableComponent;
type Observable = Rx.Observable<any> | any;

// fromComponent :: ObservableComponent -> String[] -> Observable
export function fromComponent(
	observableComponent: ObservableComponent,
	...filters: string[]
	): Observable {
	if (filters && filters.length) {
		return observableComponent
			.__eventStream
			.filter(({ type }): boolean => filters.indexOf(type) > -1);
	}
	return observableComponent.__eventStream;
}
