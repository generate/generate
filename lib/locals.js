'use strict';

var utils = require('./utils');

module.exports = function(name) {
  name = name || utils.project(process.cwd());

  return function(app) {
    app.define('locals', new Locals(name, this));
  };
};

function Locals(name, app) {
  this.cache = utils.get(app, ['cache.data', name]) || {};
}

Locals.prototype.get = function(key) {
  return utils.get(this.cache, key);
};

Locals.prototype.set = function(key, value) {
  utils.set(this.cache, key, value);
  return this;
};
