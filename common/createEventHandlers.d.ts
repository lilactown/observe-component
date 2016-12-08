export declare type HandlerFunction = (event: any) => void;
export declare type HandlerFactory = (type: string) => HandlerFunction;
export interface EventHandlers {
    [K: string]: HandlerFunction;
}
export declare function createEventHandlers(events: string[], handlerFn: HandlerFactory): EventHandlers;
