'use strict';

/**
 * Expose `Cache`
 */

module.exports = Cache;

/**
 * Create an instance of `Cache`, used to cache references to modules
 * that can be lazily instantiated in a specific context.
 */

function Cache() {
  this.data = {};
}

Cache.prototype.set = function(key, name) {
  var config = { key: key, path: null };

  if (typeof name === 'string') {
    config.path = name;

    Object.defineProperty(config, 'Ctor', {
      configurable: true,
      enumerable: true,
      get: function() {
        return require(name);
      }
    });
  } else {
    config.path = null;
    config.Ctor = name;
  }
};

Cache.prototype.get = function(key) {
  return this.data[key];
};
