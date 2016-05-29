'use strict';

var path = require('path');
var utils = require('./utils');
var plugins = require('lazy-cache')(require);
var fn = require;
require = plugins; // eslint-disable-line

/**
 * Plugins
 */

require('assemble-loader', 'loader');
require('base-cli-process', 'cli');
require('base-config-process', 'config');
require('base-fs-conflicts', 'conflicts');
require('base-fs-rename', 'rename');
require('base-generators', 'generators');
require('base-npm', 'npm');
require('base-pipeline', 'pipeline');
require('base-questions', 'questions');
require('base-runtimes', 'runtimes');
require('base-runner', 'runner');
require('base-store', 'store');
require = fn; // eslint-disable-line

plugins.destPath = function(options) {
  return function() {
    Object.defineProperty(this, 'destBase', {
      configurable: true,
      enumerable: true,
      set: function(dest) {
        this.cache.dest = path.resolve(dest);
      },
      get: function() {
        if (typeof this.cache.dest === 'string') {
          return path.resolve(this.cache.dest);
        }
        if (typeof this.options.dest === 'string') {
          return path.resolve(this.options.dest);
        }
        return process.cwd();
      }
    });
  };
};

plugins.dest = function(options) {
  return function(app) {
    var dest = this.dest;
    this.define('dest', function(dir, options) {
      var opts = utils.extend({ cwd: this.cwd }, options);
      if (typeof dir !== 'function' && typeof this.rename === 'function') {
        dir = this.rename(dir);
      }
      return dest.call(this, dir, opts);
    });
  };
};

plugins.src = function(collection) {
  return function(app) {
    collection = collection || 'templates';
    var src = this.src;

    this.define('src', function(patterns, options) {
      var opts = utils.extend({}, options);
      if (typeof opts.collection === 'undefined') {
        opts.collection = collection;
      }
      return src.call(this, patterns, opts);
    });
  };
};

/**
 * Expose plugins
 */

module.exports = plugins;
