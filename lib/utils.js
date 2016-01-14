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

// plugins and middleware
require('assemble-loader', 'loader');
require('base-argv', 'argv');
require('base-cli', 'cli');
require('base-list', 'list');
require('base-config', 'config');
require('base-pipeline', 'pipeline');
require('base-questions', 'ask');
require('base-store', 'store');
require('common-middleware', 'middleware');
require('composer-runtimes');

// cli-related
require('ansi-colors', 'colors');
require('error-symbol');
require('expand-args');
require('opn');
require('success-symbol');
require('time-stamp', 'stamp');

// generator context and convenience methods
require('find-pkg');
require('global-modules', 'gm');
require('namify');
require('project-name', 'project');
require('resolve-dir');

// misc
require('array-unique', 'unique');
require('async');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('get-value', 'get');
require('has-value', 'has');
require('kind-of', 'typeOf');
require('micromatch', 'mm');
require('matched', 'glob');
require('merge-stream', 'ms');
require('mixin-deep', 'merge');
require('parse-gitignore');
require('pkg-store');
require('spawn-commands', 'commands');
require('src-stream', 'src');
require('stream-exhaust', 'exhaust');
require('try-open');
require('through2', 'through');
require('union-value', 'union');
require('word-wrap', 'wrap');
require = fn;

utils.logger = function(Logger) {
  return function(app) {
    var logger = new Logger();

    this.define('log', function() {
      return logger.log.apply(logger, arguments);
    });

    this.define('verbose', function() {
      if (app.options.verbose === true) {
        return logger.log.apply(logger, arguments);
      }
      return '';
    });

    function bindMethod(inst, key) {
      return function() {
        return inst[key].apply(inst, arguments);
      };
    }

    function noop() {
      return '';
    }

    for (var key in logger) {
      if (key === 'options') continue;
      this.log[key] = bindMethod(logger, key);

      if (app.options.verbose) {
        this.verbose[key] = bindMethod(verbose, key);
      } else {
        this.verbose[key] = noop;
      }
    }

    return this;
  };
};

utils.pkg = function(options) {
  return function(app) {
    this.define('pkg', utils.pkgStore(app.cwd));
  };
};

/**
 * Create a view lookup method
 */

utils.getFile = function(app, collectionName, pattern) {
  // "views" are "template objects", but we're
  // exposing them as `files`
  var file = app[collectionName].getView(pattern);
  if (file) return file;

  var collection = app.getViews(collectionName);
  for (var key in collection) {
    var file = collection[key];
    if (file.basename === pattern) return file;
    if (file.filename === pattern) return file;
    if (file.path === pattern) return file;
    if (file.key === pattern) return file;
    if (utils.mm.isMatch(key, pattern)) {
      return file;
    }
  }
  return null;
};

utils.runtimes = function() {
  return function(app) {
    var self = this;
    this.use(utils.composerRuntimes({
      displayName: function(key) {
        return self.name !== key ? (self.name + ':' + key) : key;
      }
    }));
    this.define('hasRuntimes', true);
  };
};

/**
 * Green checkmark
 *
 * @return {String}
 */

utils.success = function() {
  return utils.colors.green(utils.successSymbol);
};

/**
 * Get a home-relative filepath
 */

utils.homeRelative = function(fp) {
  var dir = path.resolve(utils.resolveDir(fp));
  var root = path.resolve(utils.resolveDir('~/'));
  var fp = path.relative(root, dir);
  if (fp.charAt(0) === '/') {
    fp = fp.slice(1);
  }
  return fp;
};

/**
 * Get formatted cwd path
 */

utils.logCwd = function(app) {
  var cwd = app.cwd;
  var fp = utils.homeRelative(cwd);
  if (cwd.charAt(0) === '/') {
    cwd = cwd.slice(1);
  }
  return utils.colors.yellow('~/' + fp);
};

/**
 * Log out the path to the given config file,
 * relative to the given `root` directory
 */

utils.logConfigfile = function(app) {
  var file = app.env.config.path;

  var configPath = path.resolve(root, file);
  var fp = utils.colors.green(' ~/' + utils.homeRelative(configPath));
  var name = path.basename(file, path.extname(file));

  utils.timestamp('using ' + name + fp);
};

/**
 * Create a formatted timestamp
 *
 * @param {String} msg
 * @return {String}
 */

utils.timestamp = function(msg) {
  var time = '[' + utils.colors.gray(utils.stamp('HH:mm:ss', new Date())) + ']';
  return console.log(time, msg);
};

/**
 * Formatted check mark
 *
 * @return {String}
 */

utils.check = utils.colors.green(utils.successSymbol);

/**
 * Extend command line arguments onto the instance options.
 */

utils.processArgv = function(app, argv) {
  var args = app.processArgv(argv);
  var opts = utils.merge({}, args, args.options, args.commands);
  app.option(opts);
  return opts;
};

/**
 * Naming utils
 */

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
  name = path.basename(name, path.extname(name));
  var res = name.split('-');
  if (res.length > 1) {
    return res.slice(1).join('-');
  }
  return name;
};

utils.toKey = function(namespace, prop) {
  var key = prop.split('.')
    .filter(function(segment) {
      return segment !== namespace;
    })
    .join('.' + namespace + '.');

  return namespace + '.' + key;
};

utils.toGeneratorKey = function(key) {
  key = key.split(/\.?generators\.?/).join('.');
  if (key.charAt(0) === '.') {
    key = key.slice(1);
  }

  var res = utils.toKey('generators', key);
  if (res[res.length - 1] === '.') {
    return res.slice(0, res.length - 1);
  }
  return res;
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
    if (!utils.exists(dir)) {
      return false;
    }
    files = fs.readdirSync(dir);
    files = files.filter(fn || function(fp) {
      return !/\.DS_Store/i.test(fp)
    });
    return files.length === 0;
  } catch (err) {};
  return true;
};

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
