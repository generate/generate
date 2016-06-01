/*!
 * generate <https://github.com/jonschlinkert/generate>
 *
 * Copyright (c) 2015-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

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
  Generate.emit('generate.preInit', this);

  this.debug('initializing', __filename);
  this.define('isApp', true);

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

  // load plugins
  this.use(plugins.store());
  this.use(plugins.generators());
  this.use(plugins.pipeline());

  this.on('generator', function(alias, generator) {
    if (generator.env) {
      generator.store = new utils.Store(generator.env.name, {
        cwd: utils.resolveDir('~/.data-store')
      });
    }
  });

  this.option('lookup', function(key) {
    var patterns = [`generate-${key}`];
    if (/generate-/.test(key) && !/^(verb|assemble|update)-/.test(key)) {
      patterns.unshift(key);
    }
    return patterns;
  });

  if (utils.runnerEnabled(this)) {
    this.initGenerateCli(opts);
  }
  Generate.emit('generate.postInit', this);
};

/**
 * Initialize CLI-specific plugins and view collections.
 */

Generate.prototype.initGenerateCli = function(opts) {
  // TODO: externalize most of these to plugin or generator
  this.use(plugins.rename({replace: true}));
  this.use(plugins.conflicts(opts));
  this.use(plugins.runtimes(opts));
  this.use(plugins.questions());
  this.use(plugins.loader());
  this.use(plugins.config());
  this.use(plugins.cli());
  this.use(plugins.npm());

  // built-in view collections
  this.create('templates');
  this.create('files');
};

/**
 * Temporary error handler method. until we implement better errors.
 *
 * @param {Object} `err` Object or instance of `Error`.
 * @return {Object} Returns an error object, or emits `error` if a listener exists.
 */

Generate.prototype.handleErr = function(err) {
  if (!(err instanceof Error)) {
    err = new Error(err.toString());
  }

  if (this.options.verbose) {
    err = err.stack;
  }

  if (this.hasListeners('error')) {
    this.emit('error', err);
  } else {
    throw err;
  }
};

/**
 * Expose static `is*` methods from Templates
 */

Assemble._.plugin.is(Generate);

/**
 * Expose static properties for unit tests
 */

utils.define(Generate, 'utils', Assemble.utils);
utils.define(Generate, '_', Assemble._);

/**
 * Expose the `Generate` constructor
 */

module.exports = Generate;
