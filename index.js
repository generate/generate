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
var runner = require('./lib/runner');
var utils = require('./lib/utils');
var answers = {};

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

  // data
  this.data({runner: require('./package')});

  // expose utils
  this.define('util', utils);

  // only create a collection if it doesn't exist
  this.define('lazyCreate', function(name, opts) {
    if (!this[name]) {
      this.create(name, opts);
    } else {
      this[name].option(opts);
    }
    return this[name];
  });

  // plugins
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

  this.cache.answers = this.cache.answers || {};

  this.define('answers', function(answers, val) {
    if (typeof answers === 'string') {
      if (arguments.length === 1) {
        return this.get('cache.answers', answers);
      }
      var answer = {};
      answer[answers] = val;
      return this.answers(answer);
    }
    this.answerData = utils.merge({}, this.answerData, answers);
    return this.answerData;
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

  Object.defineProperty(this, 'answerData', {
    configurable: true,
    set: function(val) {
      answers = val;
    },
    get: function() {
      answers = utils.merge({}, answers, this.base.cache.answers);
      this.cache.answers = answers;
      return answers;
    }
  });

  if (opts.cli === true || process.env.GENERATE_CLI) {
    this.create('templates');

    this.use(plugins.runtimes(opts));
    this.use(plugins.rename({replace: true}));

    // adds prompt method, and modifies create, dest and
    // src methods to automatically use cwd from generators
    // unless overridden by the user
    util.prompt(this);
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
 * Static `runner` method that can be used to add CLI for for running
 * locally and globally installed generators when interiting `Generate`.
 *
 * `.runner` takes the name of the configfile to lookup, e.g `generator.js`,
 * and a default generator function to use as arguments, and it returns
 * a `run` function.
 *
 * The returned `run` function takes:
 *
 * - `app` **{Object}** an instance of your application
 * - `cb` **{Function}** callback to call when the runner is finished loading the user environment and pre-processing `argv` arguments.
 *
 * ```js
 * #!/usr/bin/env node
 *
 * var generate = require('generate');
 * var run = generate.runner('configfile.js', require('./foo'));
 * var app = generate();
 *
 * // generate stuff
 * run(app, function(err, argv, app) {
 *   // `err` generator errors
 *   // `argv` processed by minimist and expand-args
 *   // `app` instance with generators and tasks loaded (this is the same
 *   // app instance that was passed to `run`, exposed as a convenience)
 * });
 * ```
 * @api public
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
