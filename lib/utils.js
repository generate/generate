'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

// cli-related
require('ansi-colors', 'colors');
require('expand-args');
require('opn');
require('success-symbol');
require('time-stamp', 'stamp');

// plugins and middleware
require('base-questions', 'ask');
require('base-store', 'store');
require('base-list', 'list');
require('common-middleware', 'middleware');
require('composer-runtimes');

// generator context and convenience methods
require('global-modules', 'gm');
require('namify');
require('project-name', 'project');

// misc
require('async');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('get-value', 'get');
require('has-value', 'has');
require('kind-of', 'typeOf');
require('matched', 'glob');
require('mixin-deep', 'merge');
require('try-open');
require = fn;

utils.runtimes = function() {
  return function(app) {
    var self = this;
    this.use(utils.composerRuntimes({
      displayName: function (key) {
        return self.name !== key ? (self.name + ':' + key) : key;
      }
    }));
    this.define('hasRuntimes', true);
  };
};

/**
 * Return true if a directory exists and is empty.
 *
 * @param  {*} val
 * @return {Array}
 */

utils.isEmpty = function(dir, fn) {
  var files;
  try {
    fs.openSync(dir, 'r');
    files = fs.readdirSync(dir);
    files = files.filter(fn || filter);
    return files.length === 0;
  } catch (err) {};
  return true;
};

function filter(fp) {
  return !/\.DS_Store/i.test(fp);
}

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
  var time = '[' + utils.colors.gray(utils.stamp('HH:mm:ss', new Date())) + ']';
  return console.log(time, msg, utils.colors.green(utils.successSymbol));
};

utils.exists = function(fp) {
  return !!utils.tryOpen(fp, 'r');
};

utils.isDirectory = function(fp) {
  try {
    return fs.statSync(fp).isDirectory();
  } catch (err) {}
  return false;
};

utils.isObject = function(val) {
  return utils.typeOf(val) === 'object';
};

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.tryResolve = function(name) {
  try {
    return require.resolve(name);
  } catch (err) {}

  try {
    return require.resolve(path.resolve(name));
  } catch (err) {}

  try {
    return require.resolve(path.resolve(process.cwd(), name));
  } catch (err) {}

  try {
    return require.resolve(path.resolve(utils.gm, name));
  } catch (err) {}
};

/**
 * Try to require the given module, failing silently if
 * it doesn't exist.
 *
 * @param  {String} `name` The module name or file path
 * @return {any|Null} Returns the value of requiring the specified module, or `null`
 * @api public
 */

utils.tryRequire = function(fp) {
  try {
    return require(fp);
  } catch (err) {}

  try {
    return require(path.resolve(fp));
  } catch (err) {}

  try {
    return require(path.resolve(utils.gm, fp));
  } catch (err) {}
};

utils.alias = function(filepath, pkgName) {
  if (pkgName) {
    return utils.createAlias(pkgName);
  }
  if (!filepath) {
    filepath = utils.project(process.cwd());
  }
  if (utils.exists(filepath) && !utils.isDirectory(filepath)) {
    var dir = path.dirname(filepath);
    if (dir !== '.' && dir !== '/') {
      filepath = dir;
    }
  }
  return utils.createAlias(filepath);
};

utils.createAlias = function(name) {
  if (name == 'undefined' || typeof name !== 'string') {
    throw new Error('expected name to be a string');
  }
  var res = name.split('-');
  if (res.length > 1) {
    return res.slice(1).join('-');
  }
  return name;
};

/**
 * Modified from the `tableize` lib, which replaces
 * dashes with underscores, and we don't want that behavior.
 * Tableize `obj` by flattening and normalizing the keys.
 *
 * @param {Object} obj
 * @return {Object}
 * @api public
 */

utils.tableize = function(obj) {
  var table = {};
  flatten(table, obj, '');
  return table;
};

/**
 * Recursively flatten object keys to use dot-notation.
 *
 * @param {Object} `table`
 * @param {Object} `obj`
 * @param {String} `parent`
 */

function flatten(table, obj, parent) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var val = obj[key];

      key = parent + key;
      if (utils.isObject(val)) {
        flatten(table, val, key + '.');
      } else {
        table[key] = val;
      }
    }
  }
}

module.exports = utils;
