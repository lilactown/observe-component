"use strict";
// fromComponent :: ObservableComponent -> String[] -> Observable
function fromComponent(ObservableComponent) {
    var filters = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        filters[_i - 1] = arguments[_i];
    }
    if (filters && filters.length) {
        return ObservableComponent
            .__eventStream
            .filter(function (_a) {
            var type = _a.type;
            return filters.indexOf(type) > -1;
        });
    }
    return ObservableComponent.__eventStream;
}
exports.fromComponent = fromComponent;
