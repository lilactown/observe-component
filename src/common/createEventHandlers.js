// createEventHandlers :: String[] -> Function -> Map<String, Function>
export function createEventHandlers(events, handlerFn) {
	return events.reduce((handlerMap, type) =>
		Object.assign(handlerMap, { [type]: handlerFn(type) })
	, {});
}
