'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

module.exports = function generator(config) {
  config = config || {};

  return function(app) {
    var Runner = app.constructor;

    /**
     * Create an instance of `Generator`, optionally passing
     * a default object to initialize with.
     *
     * ```js
     * var app = new Generator({
     *   path: 'foo.html'
     * });
     * ```
     * @param {Object} `app`
     * @api public
     */

    function Generator(name, options, parent, fn) {
      if (!(this instanceof Generator)) {
        return new Generator(name, options, parent, fn);
      }

      if (typeof name === 'function') {
        return new Generator('unknown', null, null, name);
      }

      if (typeof options === 'function') {
        return new Generator(name, null, null, options);
      }

      if (typeof parent === 'function') {
        return new Generator(name, options, null, parent);
      }

      Runner.call(this, options, parent, fn);
      this.isGenerator = true;

      // reset the cache
      this.cache = {};
      this.option(config);
      this.option(options || {});

      this.files = this.views;
      utils.define(this, 'views', this.views);
      this.cache.path = name;
      this.fn = fn;
    }

    /**
     * Inherit Runner
     */

    Runner.extend(Generator);

    /**
     * Expose `Generator`
     */

    this.define('Generator', Generator);
  };
};
