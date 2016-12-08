"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
;
// createEventHandlers :: String[] -> Function -> Map<String, Function>
function createEventHandlers(events, handlerFn) {
    return events.reduce(function (handlerMap, type) {
        return (__assign({}, handlerMap, (_a = {}, _a[type] = handlerFn(type), _a)));
        var _a;
    }, {});
}
exports.createEventHandlers = createEventHandlers;
