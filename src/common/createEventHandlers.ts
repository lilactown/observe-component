// createEventHandlers :: String[] -> Function -> Map<String, Function>
export function createEventHandlers(events: string[], handlerFn: Function) {
	return events.reduce((handlerMap: Object, type: string) =>
		({...handlerMap, [type]: handlerFn(type) })
	, {});
}
