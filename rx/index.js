"use strict";
var Rx = require("rx");
var factories_1 = require("../common/factories");
var adapter = {
    subjectFactory: function () { return new Rx.Subject(); },
    emit: function (subject, v) { return subject.onNext(v); },
    toObservable: function (subject) { return subject.asObservable(); },
    filter: function (observable, predicate) { return observable.filter(predicate); },
};
exports.observeComponent = factories_1.adaptObserveComponent(adapter);
exports.fromComponent = factories_1.adaptFromComponent(adapter);
