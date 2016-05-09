'use strict';

var utils = require('./utils');
var path = require('path');
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
    Object.defineProperty(this, 'dest', {
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
      var opts = utils.extend({ renameKey: plugins.renameKey }, options);
      if (typeof opts.collection === 'undefined') {
        opts.collection = collection;
      }
      if (typeof opts.cwd === 'undefined') {
        opts.cwd = (this.env && this.env.cwd) || this.cwd;
      }
      return src.call(this, patterns, opts);
    });
  };
};

plugins.create = function(options) {
  return function customCreate(app) {
    if (this.isRegistered('custom-app-create')) return;
    if (!this.isTemplates) return;
    var create = this.create;

    this.define('create', function(name, options) {
      var config = { engine: '*', renameKey: utils.renameKey, cwd: cwd };
      var createOpts = this.option(['create', name]);
      var opts = utils.extend({}, config, createOpts, options);
      var cwd = opts.cwd ? path.resolve(opts.cwd) : this.cwd;
      if (utils.exists(path.resolve(cwd, 'templates'))) {
        cwd = path.resolve(this.cwd, 'templates');
      }

      var collection = this[name];
      if (typeof collection === 'undefined') {
        collection = create.call(this, name, opts);
      } else {
        collection.option(opts);
      }
      return collection;
    });

    return customCreate;
  };
};

/**
 * Create a view collection if it doesn't already exist.
 * If the collection exists, update the options with
 * the given options.
 */

plugins.lazyCreate = function(app) {
  return function(name, opts) {
    if (!app[name]) {
      app.create(name, opts);
    } else {
      app[name].option(opts);
    }
    return app[name];
  };
};

/**
 * Augment the `plugin` method to add plugins to the pipline
 * automatically.
 */

plugins.plugin = function(options) {
  return function(app) {
    this.options.pipeline = this.options.pipeline || [];
    var plugin = this.plugin;

    this.define('plugin', function(name) {
      var idx = this.options.pipeline.indexOf(name);
      if (idx !== -1) {
        this.options.pipeline.splice(idx, 1);
      }
      if (this.options.pipeline.indexOf(name) === -1) {
        this.options.pipeline.push(name);
      }
      plugin.apply(this, arguments);
      return this;
    });
  };
};

/**
 * Expose plugins
 */

module.exports = plugins;
