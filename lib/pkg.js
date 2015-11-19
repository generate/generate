'use strict';

var get = require('get-value');
var set = require('set-value');
var utils = require('./utils');

module.exports = function () {
  return function (app) {
    app.define('pkg', new Pkg(this.cache.data));
  };
};

function Pkg(data) {
  this.data = data || {};
}

Pkg.prototype.get = function(key) {
  return get(this.data, key);
};

Pkg.prototype.set = function(key, value) {
  set(this.data, key, value);
  return this;
};

function mixin(key, val) {
  Object.defineProperty(Pkg.prototype, key, {
    enumerable: true,
    set: val.set,
    get: val.get
  });
}

mixin('name', {
  set: function(val) {
    this.data.name = val;
  },
  get: function() {
    return this.data.name;
  }
});

mixin('nickname', {
  set: function(val) {
    this.data.nickname = val;
  },
  get: function() {
    return utils.namify(this.data.name || this.data.nickname);
  }
});
