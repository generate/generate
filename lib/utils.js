'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line

/**
 * Utils
 */

require('ask-when');
require('camel-case', 'camelcase');
require('data-store', 'Store');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('fs-exists-sync', 'exists');
require('get-value', 'get');
require('global-modules', 'gm');
require('gray-matter', 'matter');
require('helper-ask', 'ask');
require('is-answer');
require('isobject', 'isObject');
require('log-utils', 'log');
require('macro-store', 'MacroStore');
require('mixin-deep', 'merge');
require('parser-front-matter', 'parser');
require('resolve-dir');
require('resolve-file', 'resolve');
require('set-getter', 'getter');
require('strip-color', 'strip');
require('text-table', 'table');
require('through2', 'through');
require('yargs-parser', 'parse');
require = fn;

/**
 * argv options
 */

utils.opts = {
  boolean: ['diff'],
  alias: {
    add: 'a',
    config: 'c',
    configfile: 'f',
    diff: 'diffOnly',
    global: 'g',
    help: 'h',
    init: 'i',
    silent: 'S',
    verbose: 'v',
    version: 'V',
    remove: 'r'
  }
};

utils.blacklist = ['generate-function', 'generate-object-property'];

utils.parseArgs = function(argv) {
  var obj = utils.parse(argv, utils.opts);
  if (obj.init) {
    obj._.push('init');
    delete obj.init;
  }
  if (obj.help) {
    obj._.push('help');
    delete obj.help;
  }
  return obj;
};

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.renameKey = function(app) {
  var fn = app.options.renameKey;
  if (typeof fn !== 'function') {
    fn = function(key, file) {
      return file ? file.basename : path.basename(key);
    };
  }
  return fn;
};

utils.renameFile = function(app) {
  return function(file, next) {
    var dest = app.options.dest || app.cwd;
    file.base = dest;
    file.cwd = dest;

    file.path = path.join(file.base, file.basename);
    var data = utils.extend({}, file.data);

    if (utils.isObject(data.rename)) {
      for (var key in data.rename) {
        rename(dest, file, key, data.rename[key]);
      }
    }

    if (file.data.yfm) {
      file.content = utils.matter.stringify(file.content, file.data.yfm);
    }

    utils.stripPrefixes(file);
    next();
  };
};

function rename(cwd, file, key, val) {
  switch (key) {
    case 'path':
      file.path = path.resolve(file.base, val);
      break;
    case 'dirname':
      file.dirname = path.resolve(file.base, val);
      break;
    case 'relative':
      file.path = path.resolve(file.base, path.resolve(val));
      break;
    case 'basename':
      file.basename = val;
      break;
    case 'stem':
      file.stem = val;
      break;
    case 'extname':
      file.extname = val;
      break;
  }
}

/**
 * strip prefixes from dotfile and config templates
 */

utils.stripPrefixes = function(file) {
  file.basename = file.basename.replace(/^_/, '.');
  file.basename = file.basename.replace(/^\$/, '');
};

utils.getTasks = function(configFile, arrays) {
  arrays = utils.arrayify(arrays);
  var tasks = [];

  if (configFile) {
    tasks = utils.arrayify(arrays[0]);
    return tasks.length >= 1 ? tasks : ['default'];
  }

  for (var i = 0; i < arrays.length; i++) {
    var arr = utils.arrayify(arrays[i]);
    // if `default` task is defined, continue
    if (arr.length === 1 && arr[0] === 'default') {
      continue;
    }
    // if nothing is defined, continue
    if (arr.length === 0) {
      continue;
    }
    tasks = arr;
    break;
  }
  return tasks;
};

utils.firstIndex = function(arr, items) {
  items = utils.arrayify(items);
  var idx = -1;
  for (var i = 0; i < arr.length; i++) {
    if (items.indexOf(arr[i]) !== -1) {
      idx = i;
      break;
    }
  }
  return idx;
};

/**
 * Return true if the generate CLI is enabled
 */

utils.runnerEnabled = function(app) {
  if (app.options.cli === true || process.env.GENERATE_CLI === 'true') {
    return true;
  }
  // if run from the generate cwd (and not using the `gen` command)
  if (process.cwd() === path.resolve(__dirname, '..')) {
    return false;
  }
  return true;
};

/**
 * Expose utils
 */

module.exports = utils;
