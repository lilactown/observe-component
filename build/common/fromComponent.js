"use strict";
// fromComponent :: ObservableComponent -> String[] -> Observable
function fromComponent(observableComponent) {
    var filters = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        filters[_i - 1] = arguments[_i];
    }
    if (filters && filters.length) {
        return observableComponent
            .__eventStream
            .filter(function (_a) {
            var type = _a.type;
            return filters.indexOf(type) > -1;
        });
    }
    return observableComponent.__eventStream;
}
exports.fromComponent = fromComponent;
