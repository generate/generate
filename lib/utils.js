'use strict';

var path = require('path');

/**
 * Lazily require module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Utils
 */

require('ansi-cyan', 'cyan');
require('ansi-gray', 'gray');
require('ansi-green', 'green');
require('async');
require('base-pipeline', 'pipeline');
require('base-store', 'store');
require('composer-runtimes', 'runtimes');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('isobject', 'isObject');
require('matched', 'glob');
require('parser-front-matter', 'matter');
require('stream-exhaust', 'exhaust');
require('success-symbol');
require('through2', 'through');
require('time-stamp', 'stamp');
require = fn;

/**
 * Create a `File` object with `src` and `dest` properties.
 *
 * @param {Object} `file`
 * @param {Object} `opts`
 */

utils.File = function(file, opts) {
  var dest = path.relative(process.cwd(), file.dest || opts.dest);
  for (var prop in file) {
    if (!opts.hasOwnProperty(prop)) {
      if (prop === 'src' || prop === 'dest' || prop === 'path') {
        continue;
      }
      opts[prop] = file[prop];
    }
  }
  file.path = file.path || file.src;
  opts.flatten = true;
  var res = utils.mapDest(file.path, dest, opts)[0];
  file = new utils.Vinyl({
    path: res.src
  });
  for (var key in res) {
    file[key] = res[key];
  }
  file.options = utils.extend({}, opts.options, opts);
  return file;
};

/**
 * Create a formatted timestamp
 *
 * @param {String} msg
 * @return {String}
 */

utils.timestamp = function(msg) {
  var time = ' ' + utils.gray(utils.stamp('HH:mm:ss.ms', new Date()));
  return console.log(time, msg, utils.green(utils.successSymbol));
};

/**
 * Cast `value` to an array
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Try to require a module, fail silently if not found
 *
 * @param {String} name
 */

utils.tryRequire = function(name) {
  try {
    return require(name);
  } catch (err) {}
  return {};
};

/**
 * Try to resolve a module, fail silently if not found
 *
 * @param {String} name
 */

utils.tryResolve = function(name) {
  try {
    return require.resolve(name);
  } catch (err) {}
  return null;
};

/**
 * Expose utils
 */

module.exports = utils;
