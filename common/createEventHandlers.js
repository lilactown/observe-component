"use strict";
// createEventHandlers :: String[] -> Function -> Map<String, Function>
function createEventHandlers(events, handlerFn) {
    return events.reduce(function (handlerMap, type) {
        return Object.assign(handlerMap, (_a = {}, _a[type] = handlerFn(type), _a));
        var _a;
    }, {});
}
exports.createEventHandlers = createEventHandlers;
