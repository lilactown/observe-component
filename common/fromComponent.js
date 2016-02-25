"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fromComponent = fromComponent;
function fromComponent(ObservableComponent, filters) {
	if (filters && filters.length) {
		return ObservableComponent.__eventStream.filter(function (_ref) {
			var type = _ref.type;
			return filters.indexOf(type) > -1;
		});
	}
	return ObservableComponent.__eventStream;
}