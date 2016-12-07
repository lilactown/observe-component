"use strict";
var React = require("react");
var Rx = require("rx");
var createEventHandlers_1 = require("../common/createEventHandlers");
var componentEvent_1 = require("../common/componentEvent");
// observeComponent :: String[] -> Component -> ObservableComponent
function observeComponent() {
    var events = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        events[_i] = arguments[_i];
    }
    return function observableComponentFactory(Component) {
        var __eventSubject = new Rx.Subject();
        function onNext(event) {
            __eventSubject.onNext(event);
        }
        function ObservableComponent(props) {
            function createHandler(type) {
                return function handler(event) {
                    props[type] && props[type](event);
                    onNext(new componentEvent_1.ComponentEvent(type, event));
                };
            }
            var eventHandlers = createEventHandlers_1.createEventHandlers(events, createHandler);
            return (<Component {...props} {...eventHandlers}/>);
        }
        ;
        ObservableComponent.__eventStream = __eventSubject.asObservable(); // return Observable
        return ObservableComponent;
    };
}
exports.observeComponent = observeComponent;
var fromComponent_1 = require("../common/fromComponent");
exports.fromComponent = fromComponent_1.fromComponent;
