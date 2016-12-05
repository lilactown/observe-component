"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fromComponent = fromComponent;
// fromComponent :: ObservableComponent -> String[] -> Observable
function fromComponent(ObservableComponent) {
	for (var _len = arguments.length, filters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		filters[_key - 1] = arguments[_key];
	}

	if (filters && filters.length) {
		return ObservableComponent.__eventStream.filter(function (_ref) {
			var type = _ref.type;
			return filters.indexOf(type) > -1;
		});
	}
	return ObservableComponent.__eventStream;
}