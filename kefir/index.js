'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fromComponent = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.observeComponent = observeComponent;

var _fromComponent = require('../common/fromComponent');

Object.defineProperty(exports, 'fromComponent', {
	enumerable: true,
	get: function get() {
		return _fromComponent.fromComponent;
	}
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _kefir = require('kefir');

var _createEventHandlers = require('../common/createEventHandlers');

var _componentEvent = require('../common/componentEvent');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function observeComponent(Component) {
	var events = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	var __eventPool = new _kefir.pool();

	function plugEvent(event) {
		__eventPool.plug((0, _kefir.constant)(event));
	}

	function ObservableComponent(props) {
		function createHandler(type) {
			return function handler(event) {
				props[type] && props[type](event);
				plugEvent(new _componentEvent.ComponentEvent(type, event));
			};
		}
		var eventHandlers = (0, _createEventHandlers.createEventHandlers)(events, createHandler);
		return _react2.default.createElement(Component, _extends({}, props, eventHandlers));
	};

	ObservableComponent.__eventStream = __eventPool.map(function (v) {
		return v;
	}); // return Observable

	return ObservableComponent;
}