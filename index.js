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
var settings = require('./lib/settings');
var plugins = require('./lib/plugins');
var config = require('./lib/config');
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
  this.options = utils.extend({}, this.options, options);
  Assemble.call(this, options);
  this.is('Generate');
  this.initGenerate();
}

/**
 * Extend `Assemble`
 */

Assemble.extend(Generate);

/**
 * Initialize verb defaults
 */

Generate.prototype.initGenerate = function(opts) {
  this.name = 'generate';
  this.data({runner: require('./package')});

  this.define('util', utils);
  this.define('lazyCreate', function(name, opts) {
    if (!this[name]) this.create(name, opts);
  });

  this.initPlugins(this.options);
  var plugin = this.plugin;

  this.define('plugin', function(name) {
    var pipeline = this.options.pipeline;
    if (arguments.length === 1 && pipeline) {
      var idx = pipeline.indexOf(name);
      if (idx !== -1) {
        pipeline.splice(idx, 1);
      }
    }
    return plugin.apply(this, arguments);
  });
};

/**
 * Generate prototype methods
 */

Generate.prototype.initPlugins = function() {
  this.use(plugins.generators());
  this.use(plugins.pipeline());
  this.use(plugins.loader());
  this.use(plugins.runner());
  this.use(plugins.runtimes());
  this.use(plugins.rename({replace: true}));
  this.use(plugins.ask());
  this.use(settings());
  this.use(config());

  this.create('templates');
  util.create(this);
  util.dest(this);
  util.src(this);
};

/**
 * Expose `Generate`
 */

module.exports = Generate;
