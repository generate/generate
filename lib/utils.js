'use strict';

var fs = require('fs');
var path = require('path');
var pkg = require(path.resolve(__dirname, '../package'));

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('async');
require('assemble-loader', 'loader');
require('assemble-ask', 'ask');
require('base-pipeline', 'pipeline');
require('base-store', 'store');
require('base-cli', 'cli');

require('composer-runtimes', 'runtimes');
require('expand-args');
require('expand-object', 'expand');
require('extend-shallow', 'extend');
require('for-own');
require('get-value', 'get');
require('global-modules', 'gm');
require('look-up', 'lookup');
require('micromatch', 'mm');
require('object.omit', 'omit');
require('parser-front-matter', 'matter');
require('project-name', 'project');
require('question-cache', 'questions');
require('resolve-dir', 'resolve');
require('set-value', 'set');
require('union-value', 'union');

require('success-symbol');
require('ansi-yellow', 'yellow');
require('ansi-green', 'green');
require('ansi-gray', 'gray');
require('ansi-cyan', 'cyan');
require('ansi-red', 'red');
require = fn;

function Status(status) {
  status = status || {};
  this.err = status.err || null;
  this.code = status.code || null;
  this.name = status.name || '';
  this.msg = status.msg || '';
}

utils.ok = function() {
  var args = utils.toArray(arguments) || [];
  args.unshift(' ' + utils.green(utils.successSymbol));
  console.log.apply(console, args);
};
utils.success = function() {
  var args = utils.toArray(arguments) || [];
  args[0] = utils.green(args[0] || '');
  console.log.apply(console, args);
};
utils.error = function() {
  var args = utils.toArray(arguments);
  args.unshift(utils.red('Error:'));
  console.error.apply(console, args);
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

utils.identity = function(val) {
  return val;
};

utils.arrayify = function(val) {
  return Array.isArray(val) ? val : [val];
};

utils.toArray = function(val) {
  if (Array.isArray(val)) return val;
  if (val && val.length) {
    return [].slice.call(val);
  }
};

utils.contains = function(arr, key) {
  return arr.indexOf(key) > -1;
};

utils.npm = function(name) {
  return utils.tryRequire(name) || utils.tryRequire(path.resolve(name));
};

utils.exists = function(fp) {
  return fs.existsSync(fp);
};

/**
 * Create a global path for the given value
 */

utils.toGlobalPath = function(fp) {
  return '@/' + path.basename(fp, path.extname(fp));
};

/**
 * Create a global path for the given value
 */

utils.findGlobal = function(pattern) {
  return utils.lookup(pattern, { cwd: utils.gm });
};

/**
 * Get the resolved path to an "generator.js"
 */

utils.generator = function(dir) {
  return path.join(dir, 'generator.js');
};

/**
 * Rename a filepath to the "nickname" of the project.
 *
 * ```js
 * renameFn('generator-foo');
 * //=> 'foo'
 * ```
 */

utils.renameFn = function(filename, options) {
  if (options && typeof options.renameFn === 'function') {
    return options.renameFn(filename);
  }
  return filename.split(/[-\W_.]+/).pop();
};

/**
 * Return a glob of file paths
 */

utils.matchFiles = function(pattern, options) {
  options = options || {};
  var isMatch = utils.mm.matcher(pattern);
  var files = fs.readdirSync(options.cwd);
  var len = files.length, i = -1;
  var res = [];
  while (++i < len) {
    var name = files[i];
    if (name === 'generate') continue;
    var fp = path.join(options.cwd, name);
    if (isMatch(fp) || isMatch(name)) {
      res.push(fp);
    }
  }
  return res;
};

/**
 * Create a global path for the given value
 */

utils.matchGlobal = function(pattern, filename) {
  return utils.matchFiles(pattern, {cwd: utils.gm});
};

/**
 * Resolve the correct generator module to instantiate.
 * If `generate` exists in `node_modules` of the cwd,
 * then that will be used to create the instance,
 * otherwise this module will be used.
 */

utils.resolveModule = function(dir) {
  dir = path.join(dir, 'node_modules/', pkg.name);
  if (utils.exists(dir)) {
    return require(path.resolve(dir));
  }
  return null;
};

/**
 * Print a tree of "generators" and their tasks
 *
 * ```js
 * utils.tree(generators);
 * ```
 */

utils.tree = function(generators) {
  var res = '';
  for (var key in generators) {
    res += utils.cyan(key) + '\n';
    for (var task in generators[key].tasks) {
      res += ' - ' + task + '\n';
    }
  }
  return res;
};

/**
 * Return a list of "generators" and their tasks
 *
 * ```js
 * utils.list(generators);
 * ```
 */

utils.list = function(runners) {
  var list = [];
  for (var key in runners) {
    var runner = runners[key];
    if (!Object.keys(runner.tasks).length) {
      continue;
    }

    var hasDefault = runner.tasks['default'];
    var name = runner.option('name');
    var item = {
      name: name + (hasDefault ? ' (default)' : ''),
      value: key,
      short: name + (hasDefault ? ':default' : '')
    };
    list.push(item);
    for (var task in runner.tasks) {
      if (task === 'default') continue;
      list.push({
        name: ' - ' + task,
        value: key + ':' + task,
        short: key + ':' + task
      });
    }
  }
  return list;
};

/**
 * Try to require a file
 */

utils.tryRequire = function(name) {
  try {
    return require(name);
  } catch(err) {
    console.log(err);
  }
  return null;
};

/**
 * Try to read a file
 */

utils.tryRead = function(fp) {
  try {
    return fs.readFileSync(fp);
  } catch(err) {}
  return null;
};

utils.register = function(pattern, base, generate, options) {
  utils.matchFiles(pattern, options).forEach(function (fp) {
    var name = utils.project(fp);
    var mod = utils.resolveModule(fp) || generate;
    var app = mod(base.options)
        .option('name', name)
        .set('path', fp);

    require(utils.generator(fp))(app, base);
    base.generator(name, app);
  });
};

/**
 * Restore `require`
 */

require = fn;

/**
 * Expose `utils`
 */

module.exports = utils;


/**
 * Expose utils
 */

module.exports = utils;
