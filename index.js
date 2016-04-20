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
  this.is('generate');
  this.define('isApp', true);
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
  this.debug('initializing', __filename);

  // create `app.globals` store
  this.define('globals', new utils.Store('globals', {
    cwd: utils.resolveDir('~/')
  }));

  // custom `toAlias` function for resolving generators by alias
  this.option('toAlias', function(key) {
    return key.replace(/^generate-/, '');
  });

  // add `runner` to `app.cache.data`
  this.data({runner: require('./package')});

  // register async `ask` helper
  this.asyncHelper('ask', utils.ask(this));

  // initialize plugins
  this.initPlugins(this.options);
};

/**
 * Generate prototype methods
 */

Generate.prototype.initPlugins = function(opts) {
  this.debug('initializing generate plugins');

  // load plugins
  this.use(plugins.store());
  this.use(plugins.questions());
  this.use(plugins.generators());
  this.use(plugins.pipeline());
  this.use(plugins.loader());
  this.use(plugins.config());
  this.use(plugins.cli());
  this.use(plugins.npm());
  this.use(utils.plugin);

  // CLI-only
  if (opts.cli === true || process.env.GENERATE_CLI) {
    this.initCli(opts);
  }
};

/**
 * Initialize CLI-specific plugins and view collections.
 */

Generate.prototype.initCli = function(opts) {
  this.create('templates');
  this.create('files');

  this.use(plugins.rename({replace: true}));
  this.use(plugins.runtimes(opts));

  // modify the `create`, `dest` and `src` methods to automatically
  // use the cwd from generators, unless overridden by the user
  util.create(this);
  util.dest(this);
  util.src(this);
};

/**
 * Temporary error handler method. until we implement better errors.
 *
 * @param {Object} `err` Object or instance of `Error`.
 * @return {Object} Returns an error object, or emits `error` if a listener exists.
 */

Generate.prototype.handleErr = function(err) {
  if (!(err instanceof Error)) {
    throw new Error(err);
  }
  if (this.hasListeners('error')) {
    this.emit('error', err);
  }
};

/**
 * Expose static `is*` methods from Templates
 */

Assemble._.plugin.is(Generate);

/**
 * Expose `Generate`
 */

module.exports = Generate;
