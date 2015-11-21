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

// require('question-cache', 'questions');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('ansi-green', 'green');
require('success-symbol');
// require('project-name', 'project');
// require('isobject', 'isObject');
// require('set-value', 'set');
// require('get-value', 'get');
// require('resolve-dir');
// require('inflection');
// require('async');
require = fn;

/**
 * Singularize the given `name`
 */

utils.single = function(name) {
  return utils.inflection.singularize(name);
};

/**
 * Pluralize the given `name`
 */

utils.plural = function(name) {
  return utils.inflection.pluralize(name);
};

/**
 * Return the given value unchanged
 */

utils.identity = function(val) {
  return val;
};

/**
 * CLI utils
 */

utils.commands = function(argv) {
  argv._ = argv._ || [];
  var commands = {};

  argv._.forEach(function(key) {
    commands[key] = true;
  });
  return commands;
};

/**
 * Normalize config values to ensure that all of the necessary
 * properties are defined.
 */

utils.createConfig = function(config) {
  if (typeof config === 'undefined') {
    throw new TypeError('base-runner expected an options object');
  }
  config = utils.extend({}, config);
  if (!config.single && config.method) {
    config.single = utils.single(config.method);
  }
  if (!config.plural && config.method) {
    config.plural = utils.plural(config.method);
  }

  if (!config.method && !config.single && !config.plural) {
    var msg = 'expected "method", "single", or "plural" to be defined';
    throw new Error(msg);
  }
  return config;
};

/**
 * Cast `value` to an array
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Rename a filepath to the "alias" of the project.
 *
 * ```js
 * renameFn('updater-foo');
 * //=> 'foo'
 * ```
 */

utils.renameFn = function(filename, options) {
  if (options && typeof options.renameFn === 'function') {
    return options.renameFn(filename);
  }
  var strip = options.strip ? '^' + options.strip : '';
  var re = new RegExp(strip + '[-\\W_.]+');
  return filename.split(re).pop();
};

/**
 * Rename a filepath to the "alias" of the project.
 *
 * ```js
 * nameFn('updater-foo');
 * //=> 'foo'
 * ```
 */

utils.nameFn = function(fp, options) {
  if (options && typeof options.nameFn === 'function') {
    return options.nameFn(fp);
  }
  if (nameCache.hasOwnProperty(fp)) {
    return nameCache[fp];
  }
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
    fp = path.dirname(fp);
  }
  var name = path.basename(fp, path.extname(fp));
  if (name === '.') {
    name = utils.project(process.cwd());
  }
  nameCache[fp] = name;
  return name;
};

/**
 * Get the alias to use based on a filepath or "full name".
 */

utils.aliasFn = function(fp, options) {
  options = options || {};
  if (typeof options.aliasFn === 'function') {
    return options.aliasFn(fp);
  }
  var name = utils.nameFn(fp, options);
  return name.slice(name.indexOf('-') + 1);
};

/**
 * Print a tree of "generators" and their tasks
 *
 * ```js
 * utils.tree(generators);
 * ```
 */

utils.tree = function(app) {
  app.define('_tree', function() {
    var generators = this.base.generators;
    var res = '';
    for (var key in generators) {
      res += utils.cyan(key) + '\n';
      for (var task in generators[key].tasks) {
        res += ' - ' + task + '\n';
      }
    }
    return res;
  });
};

/**
 * Expose utils
 */

module.exports = utils;
