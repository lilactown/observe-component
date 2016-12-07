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
var kefir_1 = require("kefir");
var createEventHandlers_1 = require("../common/createEventHandlers");
var ComponentEvent_1 = require("../common/ComponentEvent");
// observeComponent :: String[] -> Component -> ObservableComponent
function observeComponent() {
    var events = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        events[_i] = arguments[_i];
    }
    return function observableComponentFactory(Component) {
        var __eventPool = new kefir_1.pool();
        function plugEvent(event) {
            __eventPool.plug(kefir_1.constant(event));
        }
        function ObservableComponent(props) {
            function createHandler(type) {
                return function handler(event) {
                    props[type] && props[type](event);
                    plugEvent(new ComponentEvent_1.ComponentEvent(type, event));
                };
            }
            var eventHandlers = createEventHandlers_1.createEventHandlers(events, createHandler);
            return (React.createElement(Component, __assign({}, props, eventHandlers)));
        }
        ;
        ObservableComponent.__eventStream = __eventPool.map(function (v) { return v; }); // return Observable
        return ObservableComponent;
    };
}
exports.observeComponent = observeComponent;
var fromComponent_1 = require("../common/fromComponent");
exports.fromComponent = fromComponent_1.fromComponent;
