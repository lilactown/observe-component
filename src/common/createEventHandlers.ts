// createEventHandlers :: String[] -> Function -> Map<String, Function>
export function createEventHandlers(events: string[], handlerFn: Function): any {
	return events.reduce((handlerMap: any, type: string) =>
		({...handlerMap, [type]: handlerFn(type) })
	, {});
}
