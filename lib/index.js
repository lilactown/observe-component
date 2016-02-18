'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.observeComponent = observeComponent;
exports.fromComponent = fromComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _kefir = require('kefir');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentEvent = function ComponentEvent(type, event) {
	_classCallCheck(this, ComponentEvent);

	this.type = type;
	this.event = event;
};

function observeComponent(Component) {
	var events = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	var __eventPool = new _kefir.pool();
	var eventHandlers = {};
	var plugEvent = function plugEvent(event) {
		return __eventPool.plug((0, _kefir.constant)(event));
	};

	function ObservableComponent(props) {
		events.forEach(function (type) {
			eventHandlers[type] = function (event) {
				props[type] && props[type](event);
				plugEvent(new ComponentEvent(type, event));
			};
		});

		return _react2.default.createElement(Component, _extends({}, props, eventHandlers));
	};

	ObservableComponent.__eventStream = __eventPool.map(function (v) {
		return v;
	}); // return Observable

	return ObservableComponent;
}

function fromComponent(ObservableComponent, filters) {
	if (filters && filters.length) {
		return ObservableComponent.__eventStream.filter(function (_ref) {
			var type = _ref.type;
			return filters.indexOf(type) > -1;
		});
	}
	return ObservableComponent.__eventStream;
}