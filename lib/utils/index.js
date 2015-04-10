'use strict';

var fs = require('fs');
var path = require('path');
var relative = require('relative');
var mm = require('micromatch');

/**
 * Extend `utils` methods in other files
 */

var utils = require('export-files')(__dirname);

/**
 * Read a file
 */

utils.arrayify = function arrayify(val) {
  return Array.isArray(val) ? val : [val];
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
