'use strict';

var paths = require('base-paths');
var Base = require('assemble-core');
var resolver = require('base-resolver');
var generator = require('./lib/generator');
var utils = require('./lib/utils');

/**
 * Expose `Generate`
 */

module.exports = Generate;

/**
 * Create an instance of `Generate` with the given `options`.
 *
 * ```js
 * var generators = new Generate();
 * ```
 * @param {Object} `options`
 * @api public
 */

function Generate(options) {
  if (!(this instanceof Generate)) {
    return new Generate(options);
  }

  Base.call(this);
  this.options = options || {};
  this.name = 'generate';
  this.isGenerate = true;
  this.isGenerator = false;
  this.generators = {};
  this.config = {};

  this.initGenerate();
  this.use(generator());
  this.use(resolver(this.Generator, {
    method: 'generator'
  }));

  this.use(paths());
}

/**
 * Inherit 'Base'
 */

Base.extend(Generate);

/**
 * Initialize Generate defaults
 */

Generate.prototype.initGenerate = function() {
  // custom middleware handlers
  this.handler('onStream');
  this.handler('preWrite');
  this.handler('postWrite');
};

/**
 * Load multiple generators.
 *
 * ```js
 * generators.loadGenerators({
 *   'a.js': {path: '...'},
 *   'b.js': {path: '...'},
 *   'c.js': {path: '...'}
 * });
 * ```
 * @param {Object|Array} `generators`
 * @return {Object} returns the instance for chaining
 * @api public
 */

Generate.prototype.loadGenerators = function(generators, options) {
  for (var key in generators) {
    this.generator(key, options, generators[key]);
  }
  return this;
};

/**
 * Get an generator from the generators.
 *
 * ```js
 * generators.getGenerator('a.html');
 * ```
 * @param {String} `key` Key of the generator to get.
 * @return {Object}
 * @api public
 */

Generate.prototype.getGenerator = function(key) {
  return this.generators[key] || this.generators[this.alias(key)];
};
