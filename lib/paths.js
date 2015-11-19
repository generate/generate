'use strict';

var get = require('get-value');
var set = require('set-value');

module.exports = function () {
  return function (app) {
    app.define('paths', new Paths());

    function Paths() {}

    Paths.prototype.get = function(key) {
      return get(this, key);
    };

    Paths.prototype.set = function(key, value) {
      set(this, key, value);
      return this;
    };
  };
};

