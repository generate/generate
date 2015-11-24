'use strict';

var fs = require('fs');
var path = require('path');
var resolveCache = {};
var resolveModuleCache = {};
var modulePathCache = {};
var nameCache = {};

/**
 * Lazily require module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Utils
 */


require('assemble-loader', 'loader');
require('base-pipeline', 'pipeline');
require('base-store', 'store');
require('matched', 'glob');

// require('question-cache', 'questions');
require('parser-front-matter', 'matter');
require('composer-runtimes', 'runtimes');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('time-stamp', 'stamp');
require('ansi-green', 'green');
require('ansi-gray', 'gray');
require('ansi-cyan', 'cyan');
require('success-symbol');
// require('project-name', 'project');
require('isobject', 'isObject');
// require('set-value', 'set');
// require('get-value', 'get');
// require('resolve-dir');
// require('inflection');
// require('async');
require = fn;


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

utils.tryRequire = function(name) {
  try {
    return require(name);
  } catch (err) {};
  return {};
};

utils.tryResolve = function(name) {
  try {
    return require.resolve(name);
  } catch (err) {};
  return null;
};

/**
 * Expose utils
 */

module.exports = utils;
