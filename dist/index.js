"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hexagon;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getUsePorts = function getUsePorts(fn, name) {
  var ports = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function () {
    var newPorts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return createHexagon(fn, name, _objectSpread({}, ports, newPorts));
  };
};

var getExecute = function getExecute(fn) {
  var ports = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function () {
    var newPorts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var allPorts = _objectSpread({}, ports, newPorts);

    if (Object.keys(allPorts).length === 0) {
      allPorts = undefined;
    }

    fn(allPorts);
  };
};

var createHexagon = function createHexagon(fn, name) {
  var ports = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return {
    name: name,
    usePorts: getUsePorts(fn, name, ports),
    execute: getExecute(fn, ports)
  };
};

function hexagon(useCaseFn) {
  return createHexagon(useCaseFn, "useCase(".concat(useCaseFn.name, ")"), {});
}