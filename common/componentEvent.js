"use strict";
var ComponentEvent = (function () {
    function ComponentEvent(type, value, props) {
        this.type = type;
        this.value = value;
        this.props = props;
    }
    return ComponentEvent;
}());
exports.ComponentEvent = ComponentEvent;
