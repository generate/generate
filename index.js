/*!
 * generate <https://github.com/jonschlinkert/generate>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var util = require('generator-util');
var Assemble = require('assemble-core');
var plugins = require('./lib/plugins');
var utils = require('./lib/utils');
var debug = Assemble.debug;

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

  this.options = utils.extend({}, this.options, options);
  Assemble.call(this, this.options);

  this.is('generate');
  this.define('isApp', true);
  debug(this);

  this.debug('initializing');
  this.initGenerate(this.options);
}

/**
 * Extend `Generate`
 */

Assemble.extend(Generate);

/**
 * Initialize generate defaults
 */

Generate.prototype.initGenerate = function(opts) {
  this.debug('initializing generate defaults');
  this.name = 'generate';

  this.debug('creating globals store');
  this.define('globals', new utils.Store('globals', {
    cwd: utils.resolveDir('~/')
  }));

  // data
  this.data({runner: require('./package')});

  // asyn `ask` helper
  this.asyncHelper('ask', utils.ask(this));

  // only create a collection if it doesn't exist
  this.define('lazyCreate', utils.lazyCreate(this));
  if (this.utils) this.define('utils', this.utils);

  // plugins
  this.initPlugins(this.options);
  utils.plugin(this);
};

/**
 * Generate prototype methods
 */

Generate.prototype.initPlugins = function(opts) {
  this.debug('initializing generate plugins');

  this.use(plugins.store());
  this.use(plugins.questions());
  this.use(plugins.generators());
  this.use(plugins.pipeline());
  this.use(plugins.loader());

  if (opts.cli === true || process.env.GENERATE_CLI) {
    this.create('templates');

    this.use(plugins.runtimes(opts));
    this.use(plugins.rename({replace: true}));

    // modifies create, dest and src methods to automatically
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
 * Expose static `is*` methods from Templates
 */

Assemble._.plugin.is(Generate);

/**
 * Expose `Generate`
 */

module.exports = Generate;
