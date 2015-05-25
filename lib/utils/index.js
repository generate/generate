'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var del = require('del');
var mm = require('micromatch');
var mdu = require('markdown-utils');
var relative = require('relative');
var mkdirp = require('mkdirp');
var chalk = require('chalk');
var symbol = require('log-symbols');
var _ = require('lodash');
var bold = chalk.bold;

/**
 * Expose `utils`
 */

var utils = module.exports = require('export-files')(__dirname);

/**
 * Detect if the user has specfied not to render a vinyl template.
 *
 * @return {Boolean}
 */

utils.norender = function norender(app, file, locals) {
  return app.isTrue('norender') || app.isFalse('render')
    || file.norender === true || file.render === false
    || locals.norender === true || locals.render === false;
};

/**
 * Create a url from the given `domain`, optionally pass `true`
 * as the second argument to use `https` as the protocol.
 *
 * @param  {String} `domain`
 * @param  {String} `https`
 * @return {String}
 */

utils.linkify = function linkify(domain, https) {
  return function (author) {
    if (typeof author !== 'object') {
      throw new TypeError('utils.linkify expects author to be an object.');
    }

    var username = author.username;
    if (typeof username === 'undefined') {
      username = this.context[domain] && this.context[domain].username;
    }

    if (typeof username === 'undefined') {
      username = this.config.get(domain + '.username');
    }

    if (typeof username === 'object') {
      var o = username;
      username = o.username;
    }

    if (!username) return '';

    var protocol = https ? 'https://' : 'http://';
    var res = mdu.link(domain + '/' + username, protocol + domain + '.com/' + username);
    return '+ ' + res;
  };
};

/**
 * Bind a `thisArg` to all the functions on the target
 *
 * @param  {Object|Array} `target` Object or Array with functions as values that will be bound.
 * @param  {Object} `thisArg` Object to bind to the functions
 * @return {Object|Array} Object or Array with bound functions.
 */

utils.bindAll = function bindAll(target, thisArg) {
  if (Array.isArray(target)) {
    return target.map(function (fn) {
      return _.bind(fn, thisArg);
    });
  }

  return _.reduce(target, function (acc, fn, key) {
    if (typeof fn === 'object' && typeof fn !== 'function') {
      acc[key] = utils.bindAll(fn, thisArg);
    } else {
      acc[key] = _.bind(fn, thisArg);
      if (fn.async) {
        acc[key].async = fn.async;
      }
    }
    return acc;
  }, {});
};

/**
 * Returns a matching function to use against
 * the list of given files.
 */

utils.files = function files_(arr) {
  return function(pattern, options) {
    return mm(arr, pattern, options);
  };
};

/**
 * Run middleware in series
 */

utils.series = function series(fns) {
  return function (file, cb) {
    async.eachSeries(fns, function (fn, next) {
      fn(file, next);
    }, cb);
  };
};

/**
 * Push a collection of templates into the stream (as vinyl files)
 */

utils.pushToStream = function pushToStream(collection, stream, fn) {
  var i = 0;
  for (var key in collection) {
    if (collection.hasOwnProperty(key)) {
      var file = collection[key];
      stream.push(fn ? fn(file, i++) : file);
    }
  }
};

utils.copy = function copy(src, dest) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dest));
};

utils.copyFiles = function copyFiles(files, dest) {
  for (var i = 0; i < files.length; i++) {
    var fp = files[i];
    utils.copy(fp, path.join(dest, path.basename(fp)));
  }
};

utils.del = function del_(fp, opts) {
  if (!fs.existsSync(fp)) {
    if (opts && opts.silent !== true) {
      console.log(symbol.error, bold(fp), 'does not exist.');
    }
  } else {
    del.sync(fp, opts && opts.force);
    console.log(symbol.success, 'deleted', bold(fp));
  }
};

utils.rename = function rename(src, dest, opts) {
  opts = opts || {};

  if (path.resolve(src) === path.resolve(dest)) {
    if (opts.silent !== true) {
      console.log(symbol.warning, bold(src), 'and', bold(dest), 'are the same path.');
    }
  } else if (!fs.existsSync(src)) {
    if (opts.silent !== true) {
      console.log(symbol.error, bold(src), 'does not exist.');
    }
  } else if (fs.existsSync(dest) && opts.force !== true) {
    if (opts.silent !== true) {
      console.log(symbol.warning, bold(dest), 'already exists (to force, pass `true` as the last argument).');
    }
  } else {
    console.log(symbol.success, 'renamed', bold(src), '=>', bold(dest));
    fs.renameSync(src, dest);
  }
};

utils.move = function move(src, dest, force) {
  var dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }
  utils.rename(src, dest, force);
};

/**
 * Cast `val` to an array.
 */

utils.arrayify = function arrayify(val) {
  var isArray = Array.isArray(val);
  if (typeof val !== 'string' && !isArray) {
    throw new Error('utils.arrayify() expects a string or array.');
  }
  return isArray ? val : [val];
};

/**
 * Read a file
 */

utils.readFile = function readFile(fp) {
  return fs.readFileSync(fp, 'utf8');
};

/**
 * Write a file
 */

utils.writeFile = function writeFile(fp, str) {
  return fs.writeFileSync(fp, str);
};

/**
 * Creates a matching function to use against
 * the list of given files.
 */

utils.match = function match(files) {
  return function(pattern, options) {
    return mm(files, pattern, options);
  };
};

/**
 * Get the basename of a file path, excluding extension.
 *
 * @param {String} `fp`
 * @param {String} `ext` Optionally pass the extension.
 */

utils.basename = function basename(fp, ext) {
  return fp.substr(0, fp.length - (ext || path.extname(fp)).length);
};

/**
 * Default `renameKey` function.
 */

utils.renameKey = function renameKey(fp, acc, opts) {
  fp = relative.toBase(opts.cwd, fp);
  return utils.basename(fp);
};

/**
 * Try to call `fn` on `filepath`, either returning the
 * result when successful, or failing silently and
 * returning null.
 */

utils.tryCatch = function tryCatch(fn, fp) {
  try {
    return fn(path.resolve(fp));
  } catch(err) {}
  return null;
};

/**
 * Try to resolve the given path, or fail silently
 */

utils.tryRequire = function tryRequire(fp) {
  return utils.tryCatch(require, fp);
};

/**
 * Try to resolve the given path, or fail silently
 */

utils.tryResolve = function tryResolve(fp) {
  return utils.tryCatch(require.resolve, fp);
};

/**
 * Try to read a file, or fail silently
 */

utils.tryRead = function tryRead(fp) {
  return utils.tryCatch(utils.readFile, fp);
};

/**
 * Try to read a directory of files. Silently catches
 * any errors and returns an empty array.
 */

utils.tryStat = function tryStat(fp) {
  return utils.tryCatch(fs.statSync, fp);
};

/**
 * Read a file
 */

utils.tryReadJson = function tryReadJson(fp) {
  try {
    return JSON.parse(utils.readFile(fp));
  } catch(err) {}
  return null;
};

/**
 * Try to read a directory of files. Silently catches
 * any errors and returns an empty array.
 */

utils.tryReaddir = function tryReaddir(fp) {
  try {
    return fs.readdirSync(fp);
  } catch (err) {}
  return [];
};

/**
 * Expose `utils`
 */

module.exports = utils;
