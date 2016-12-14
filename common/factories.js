"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var createEventHandlers_1 = require("./createEventHandlers");
var ComponentEvent_1 = require("./ComponentEvent");
function adaptObserveComponent(adapter) {
    return function observeComponent() {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        return function observableComponentFactory(Component) {
            var __eventSubject = adapter.subjectFactory();
            function HOC(props) {
                function createHandler(type) {
                    return function handler(event) {
                        props[type] && props[type](event);
                        adapter.emit(__eventSubject, new ComponentEvent_1.ComponentEvent(type, event, props));
                    };
                }
                var eventHandlers = createEventHandlers_1.createEventHandlers(events, createHandler);
                // return React.createElement(Component, {...props, ...eventHandlers})
                return (React.createElement(Component, __assign({}, props, eventHandlers)));
            }
            ;
            HOC.__eventStream = adapter.toObservable(__eventSubject); // return Observable
            return HOC;
        };
    };
}
exports.adaptObserveComponent = adaptObserveComponent;
function adaptFromComponent(adapter) {
    return function fromComponent(observableComponent) {
        var filters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            filters[_i - 1] = arguments[_i];
        }
        if (filters && filters.length) {
            return adapter.filter(observableComponent.__eventStream, function (_a) {
                var type = _a.type;
                return filters.indexOf(type) > -1;
            });
        }
        return observableComponent.__eventStream;
    };
}
exports.adaptFromComponent = adaptFromComponent;
