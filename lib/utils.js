'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('extend-shallow', 'extend');
require('time-stamp', 'stamp');
require('ansi-colors', 'colors');
require('matched', 'glob');
require('success-symbol');
require('assemble-core');
require('base-runner');

/**
 * Restore `require`
 */

require = fn;

/**
 * Convenience method for loading files.
 */

utils.globFiles = function(patterns, options) {
  var opts = utils.extend({dot: true}, options);
  opts.cwd = opts.cwd || process.cwd();
  opts.ignore = ['**/.DS_Store', '**/.git'];
  opts.realpath = true;
  return utils.glob.sync(patterns, opts);
};

/**
 * Create a formatted timestamp
 *
 * @param {String} msg
 * @return {String}
 */

utils.timestamp = function(msg) {
  var time = ' ' + utils.colors.gray(utils.stamp('HH:mm:ss.ms', new Date()));
  return console.log(time, msg, utils.colors.green(utils.successSymbol));
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
