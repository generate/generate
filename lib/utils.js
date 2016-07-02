'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line

/**
 * Utils
 */

require('ask-when');
require('data-store', 'Store');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('fs-exists-sync', 'exists');
require('get-value', 'get');
require('global-modules', 'gm');
require('gray-matter', 'matter');
require('is-answer');
require('isobject', 'isObject');
require('log-utils', 'log');
require('macro-store', 'MacroStore');
require('mixin-deep', 'merge');
require('parser-front-matter', 'parser');
require('resolve-dir');
require('resolve-file', 'resolve');
require = fn; // eslint-disable-line

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

utils.logger = function(prop, color) {
  color = color || 'dim';
  return function(msg) {
    var rest = [].slice.call(arguments, 1);
    return console.log
      .bind(console, utils.log.timestamp, utils.log[prop])
      .apply(console, [utils.log[color](msg), ...rest]);
  };
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
 * Async helper that prompts the user and populates a template
 * with the answer.
 *
 * ```html
 * <%%= ask('author.name') %>
 * ```
 * @param {Object} `app`
 * @return {Function} Returns the helper function
 * @api public
 */

utils.ask = function(app) {
  return function ask(name, message, options, cb) {
    var args = [].slice.call(arguments, 1);
    cb = args.pop();

    if (typeof cb !== 'function') {
      throw new TypeError('expected a callback function');
    }

    var ask = utils.askWhen;
    var last = args[args.length - 1];
    var opts = {};

    if (utils.isObject(last)) {
      options = args.pop();
    }

    last = args[args.length - 1];
    if (typeof last === 'string') {
      opts.message = args.pop();
    }

    options = utils.merge({}, this.options, this.context, opts, options);
    options.save = false;

    ask.when(this.app, name, options, function(err, answers) {
      if (err) {
        cb(err);
        return;
      }
      app.data(answers);
      cb(null, utils.get(answers, name));
    });
  };
};

/**
 * Expose utils
 */

module.exports = utils;
