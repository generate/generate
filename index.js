'use strict';

var templates = require('./lib/templates');
var middleware = require('common-middleware');
var Base = require('assemble-core');

/**
 * Create an instance of `Generate` with the given `options`
 *
 * ```js
 * var generate = new Generate(options);
 * ```
 * @param {Object} `options` Configuration options to initialize with.
 * @api public
 */

function Generate(options) {
  if (!(this instanceof Generate)) {
    return new Generate(options);
  }

  Base.apply(this, arguments);
  this.use(middleware());

  this.engine(['md', 'text'], require('engine-base'));
  this.on('register', function(name, app) {
    templates(app);
  });

  this.name = this.options.name || 'base';
  this.isGenerate = true;
  this.generators = {};
}

/**
 * Inherit assemble-core
 */

Base.extend(Generate);

/**
 * Initialize Generate defaults
 */

Generate.prototype.initGenerate = function() {
  // defaults here
};

/**
 * Expose `Generate`
 */

module.exports = Generate;
