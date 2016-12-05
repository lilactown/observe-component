// fromComponent :: ObservableComponent -> String[] -> Observable
export function fromComponent(ObservableComponent, filters) {
	if (filters && filters.length) {
		return ObservableComponent
			.__eventStream
			.filter(({type}) => filters.indexOf(type) > -1)
	}
	return ObservableComponent.__eventStream;
}
