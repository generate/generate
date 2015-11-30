/*!
 * base-metadata <https://github.com/jonschlinkert/base-metadata>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./utils');

module.exports = function(prop, method) {
  method = method || 'metadata';

  return function() {
    var cache = (this.cache.data[prop] || (this.cache.data[prop] = {}));
    this.define(method, new Metadata());

    function Metadata() {}

    Metadata.prototype.set = function(key, value) {
      utils.set(cache, key, value);
      return this;
    };

    Metadata.prototype.has = function(key) {
      return utils.has(cache, key);
    };

    Metadata.prototype.get = function(key) {
      return utils.get(cache, key);
    };
  };
};

