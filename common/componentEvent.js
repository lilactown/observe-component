"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentEvent = exports.ComponentEvent = function ComponentEvent(type, value) {
	_classCallCheck(this, ComponentEvent);

	this.type = type;
	this.value = value;
};