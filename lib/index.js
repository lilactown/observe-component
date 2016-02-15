'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.streamComponent = streamComponent;
exports.getStream = getStream;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _kefir = require('kefir');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function streamComponent(Component) {
	var events = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	var __eventPool = new _kefir.pool();
	var eventEmitters = {};

	var plugEvent = function plugEvent(e) {
		return __eventPool.plug((0, _kefir.constant)(e));
	};

	function StreamableComponent(props) {
		var map = props.map || function (o) {
			return o;
		};
		events.forEach(function (event) {
			eventEmitters[event] = function (e) {
				props[event] && props[event](e);
				plugEvent(map({ event: event, e: e }));
			};
		});

		return _react2.default.createElement(Component, _extends({}, props, eventEmitters));
	};

	StreamableComponent.__eventStream = __eventPool.map(function (v) {
		return v;
	}); // return Observable

	return StreamableComponent;
}

function getStream(StreamableComponent) {
	return StreamableComponent.__eventStream;
}