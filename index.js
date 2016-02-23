'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rx = exports.Kefir = undefined;

var _kefir = require('./kefir');

var Kefir = _interopRequireWildcard(_kefir);

var _rx = require('./rx');

var Rx = _interopRequireWildcard(_rx);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.Kefir = Kefir;
exports.Rx = Rx;