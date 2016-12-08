export type HandlerFunction = (event: any) => void;
export type HandlerFactory = (type: string) => HandlerFunction;
export interface EventHandlers {
	[K: string]: HandlerFunction, 
};

// createEventHandlers :: String[] -> Function -> Map<String, Function>
export function createEventHandlers(events: string[], handlerFn: HandlerFactory): EventHandlers {
	return events.reduce((handlerMap: EventHandlers, type) =>
		({...handlerMap, [type]: handlerFn(type) })
	, {});
}
