"use strict";
var Kefir = require("kefir");
var factories_1 = require("../common/factories");
var adapter = {
    subjectFactory: function () { return Kefir.pool(); },
    emit: function (pool, v) { return pool.plug(v); },
    toObservable: function (pool) { return pool.map(function (v) { return v; }); },
    filter: function (observable, predicate) { return observable.filter(predicate); },
};
exports.observeComponent = factories_1.adaptObserveComponent(adapter);
exports.fromComponent = factories_1.adaptFromComponent(adapter);
