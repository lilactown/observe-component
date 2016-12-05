"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createEventHandlers = createEventHandlers;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// createEventHandlers :: String[] -> Function -> Map<String, Function>
function createEventHandlers(events, handlerFn) {
	return events.reduce(function (handlerMap, type) {
		return Object.assign(handlerMap, _defineProperty({}, type, handlerFn(type)));
	}, {});
}