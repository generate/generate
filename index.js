/*!
 * generate <https://github.com/jonschlinkert/generate>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('generate');
var Assemble = require('assemble-core');
var defaults = require('./lib/defaults');
var plugins = require('./lib/plugins');
var mixins = require('./lib/mixins');
var utils = require('./lib/utils');
var setArgs;

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

  Assemble.call(this, options);
  this.paths = this.paths || {};
  this.is('generate');
  this.initGenerate(this.options);

  if (!setArgs) {
    setArgs = true;
    this.base.option(utils.argv);
  }
}

/**
 * Extend `Generate`
 */

Assemble.extend(Generate);

/**
 * Initialize Stores
 */

plugins.stores(Generate.prototype);

/**
 * Initialize generate defaults
 */

Generate.prototype.initGenerate = function(opts) {
  debug('initializing from <%s>', __filename);
  Generate.emit('generate.preInit', this);

  // initialize defaults
  defaults(Generate, this);

  // load listeners
  Generate.initGenerateListeners(this);

  // load middleware
  if (!process.env.GENERATE_TEST) {
    Generate.initGenerateMiddleware(this);
  }

  // load CLI plugins
  if (utils.runnerEnabled(this)) {
    this.initGenerateCLI(opts);
  }
  Generate.emit('generate.postInit', this);
};

/**
 * Initialize CLI-specific plugins and view collections.
 */

Generate.prototype.initGenerateCLI = function(options) {
  Generate.initGenerateCLI(this, options);
};

/**
 * Temporary error handler method. until we implement better errors.
 *
 * @param {Object} `err` Object or instance of `Error`.
 * @return {Object} Returns an error object, or emits `error` if a listener exists.
 */

Generate.prototype.handleErr = function(err) {
  return Generate.handleErr(this, err);
};

/**
 * Add static methods
 */

mixins(Generate);

/**
 * Expose the `Generate` constructor
 */

module.exports = Generate;
