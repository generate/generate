/*!
 * generate <https://github.com/jonschlinkert/generate>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var ask = require('assemble-ask');
var Core = require('assemble-core');
var loader = require('assemble-loader');
var config = require('base-config');
var plugin = require('./lib/plugins');
var utils = require('./lib/utils');

/**
 * Create an instance of `Generate` with the given `options`
 *
 * ```js
 * var Generate = require('generate');
 * var generate = new Generate();
 * ```
 * @param {Object} `options`
 * @api public
 */

function Generate(options) {
  if (!(this instanceof Generate)) {
    return new Generate(options);
  }
  Core.call(this, options);
  this.name = this.options.name || 'generate';
  this.initGenerate(this);
}

/**
 * Inherit assemble-core
 */

Core.extend(Generate);

/**
 * Initialize Generater defaults
 */

Generate.prototype.initGenerate = function(base) {
  this.define('isGenerate', true);
  this.set('generators', {});

  this.use(plugin.locals({name: this.name}));
  this.use(plugin.store({name: this.name}));
  this.use(config());
  this.use(loader());
  this.use(ask());
};

/**
 * Register generator `name` with the given `generate`
 * instance.
 *
 * @param {String} `name`
 * @param {Object} `generate` Instance of generate
 * @return {Object} Returns the instance for chaining
 */

Generate.prototype.generator = function(name, generate) {
  if (arguments.length === 1) {
    return this.generators[name];
  }
  generate.use(utils.runtimes({
    displayName: function(key) {
      return utils.cyan(name + ':' + key);
    }
  }));
  return (this.generators[name] = generate);
};

Generate.prototype.hasGenerater = function(name) {
  return this.generators.hasOwnProperty(name);
};

Generate.prototype.opts = function(prop, options) {
  var args = [].concat.apply([], [].slice.call(arguments, 1));
  args.unshift(this.option(prop));
  return utils.extend.apply(utils.extend, args);
};

/**
 * Expose `Generate`
 */

module.exports = Generate;

/**
 * Expose `utils`
 */

module.exports.utils = utils;
module.exports.meta = require('./package');
module.exports.dir = __dirname;
