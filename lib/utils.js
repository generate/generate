'use strict';

var fs = require('fs');
var path = require('path');
var processArgs = require('./argv');

/**
 * Module dependencies
 */

var utils = module.exports = require('lazy-cache')(require);
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
  }
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

utils.processArgs = function(argv, app, base, env) {
  var args = processArgs(argv, app, base, env);
  env.argv = args;
  env.argv.raw = argv;
  app.option(args.options);
  app.cli.process(args.commands);
  return args;
};

utils.build = function(app) {
  var fn = app.build;
  delete app.build;


  app.define('build', function(argv, cb) {
    var args = utils.processArgs(argv, app, app.base, app.env);
    app.emit('argv', argv);

    if (app.option('tasks.choose')) {
      return chooseTasks(app, cb);
    }

    args.unknown.forEach(function(arg) {
      app.emit('error', 'cannot resolve argument: ' + arg);
    });

    utils.async.each(args.tasks, function(tasks, next) {
      if (!tasks) return next();
      var arg = tasks.split(':');

      try {
        if (arg.length === 1) {
          fn.call(app, toTasks(tasks), next);
        } else {
          var generator = lookupGenerator(arg[0], app);
          generator.option(args.options);
          if (!generator.env) generator.env = app.env;
          generator.env.argv = args;
          tasks = toTasks(arg[1]);
          fn.call(generator, tasks, next);
        }
      } catch (err) {
        next(err);
      }
    }, cb);
  });
};

function toTasks(tasks) {
  if (typeof tasks === 'string') {
    return tasks.split(',');
  }
  return tasks;
}

function lookupGenerator(name, generate) {
  var app = generate.get(name);
  if (app && !app.isGenerate) {
    app = generate.registerPath(app.alias, app.path);
  }
  return app;
}

function chooseTasks(app, cb) {
  app.disable('choose');
  app.disable('tasks.choose');
  app.chooseTasks(function(err, results) {
    if (err) throw err;
    var obj = utils.tableize(results, true);
    var res = '';
    for (var key in obj) {
      var val = obj[key];
      if (Array.isArray(val)) {
        val = val.join(',');
      }
      res += key + ':' + val;
    }
    app.build(res, cb);
  });
}

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
