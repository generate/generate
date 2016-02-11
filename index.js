/*!
 * generate <https://github.com/jonschlinkert/generate>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var util = require('generator-util');
var Assemble = require('assemble-core');
var plugins = require('./lib/plugins');
var runner = require('./lib/runner');
var utils = require('./lib/utils');

/**
 * Create an instance of `Generate` with the given `options`
 *
 * ```js
 * var Generate = require('generate');
 * var generate = new Generate();
 * ```
 * @param {Object} `options` Settings to initialize with.
 * @api public
 */

function Generate(options) {
  if (!(this instanceof Generate)) {
    return new Generate(options);
  }
  this.options = utils.extend({prefix: 'generate'}, this.options, options);
  Assemble.call(this, options);
  this.initGenerate();
}

/**
 * Extend `Assemble`
 */

Assemble.extend(Generate);

/**
 * Initialize generate defaults
 */

Generate.prototype.initGenerate = function(opts) {
  this.is('generate');
  this.name = 'generate';
  this.data({runner: require('./package')});

  this.define('util', utils);
  this.define('lazyCreate', function(name, opts) {
    if (!this[name]) {
      this.create(name, opts);
    } else {
      this[name].option(opts);
    }
    return this[name];
  });

  this.initPlugins(this.options);
  var plugin = this.plugin;

  this.define('plugin', function(name) {
    var pipeline = this.options.pipeline || [];
    if (arguments.length === 1 && pipeline.length) {
      var idx = pipeline.indexOf(name);
      if (idx !== -1) {
        pipeline.splice(idx, 1);
      }
    } else if (!~pipeline.indexOf(name)) {
      pipeline.push(name);
    }
    plugin.apply(this, arguments);
    return this;
  });
};

/**
 * Generate prototype methods
 */

Generate.prototype.initPlugins = function(opts) {
  this.use(plugins.generators());
  this.use(plugins.pipeline());
  this.use(plugins.runner());
  this.use(plugins.loader());

  if (opts.cli === true || process.env.GENERATE_CLI) {
    this.create('templates');

    this.use(plugins.runtimes(opts));
    this.use(plugins.rename({replace: true}));
    this.use(plugins.ask());

    // modify create, dest and src methods to automatically
    // use cwd from generators unless overridden by the user
    util.create(this);
    util.dest(this);
    util.src(this);
  }
};

/**
 * Temporary error handler method. until we implement better errors.
 *
 * @param {Object} `err` Object or instance of `Error`.
 * @return {Object} Returns an error object, or emits `error` if a listener exists.
 */

Generate.prototype.handleErr = function(err) {
  if (!(err instanceof Error)) {
    err = new Error(err);
  }
  if (this.hasListeners('error')) {
    return this.emit('error', err);
  }
  throw err;
};

/**
 * Expose static `runner` method
 */

Generate.runner = runner;

/**
 * Expose static `is*` methods from Templates
 */

Assemble._.plugin.is(Generate);

/**
 * Expose `Generate`
 */

module.exports = Generate;
