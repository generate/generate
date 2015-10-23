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
  this.use(plugin.config());
  this.use(loader());
  this.use(ask());

  this.engine(['md', 'tmpl'], require('engine-base'));
  this.onLoad(/\.(md|tmpl)$/, function (view, next) {
    view.content = view.contents.toString();
    utils.matter.parse(view, next);
  });
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

Generate.prototype.build = function() {
  var fn = Core.prototype.build;
  this.emit('build');
  return fn.apply(this, arguments);
};

Generate.prototype.hasGenerater = function(name) {
  return this.generators.hasOwnProperty(name);
};

Generate.prototype.hasTask = function(name) {
  return this.taskMap.indexOf(name) > -1;
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
