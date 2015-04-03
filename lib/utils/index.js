'use strict';

var fs = require('fs');
var path = require('path');
var mm = require('micromatch');

/**
 * Extend `utils` methods in other files
 */

var utils = require('export-files')(__dirname);

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
 * Try to resolve the given path, fail silently
 */

utils.tryResolve = function tryResolve(fp) {
  try {
    return require.resolve(fp);
  } catch(err) {}
  return [];
};

/**
 * Read a file
 */

utils.tryRead = function tryRead(fp) {
  try {
    return fs.readFileSync(fp, 'utf8');
  } catch(err) {}
  return null;
};

/**
 * Read a file
 */

utils.tryReadJson = function tryReadJson(fp) {
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch(err) {}
  return null;
};

/**
 * Try to read a directory of files. Silently catches
 * any errors and returns an empty array.
 */

utils.tryStat = function tryStat(fp) {
  try {
    return fs.statSync(fp);
  } catch (err) {}
  return [];
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
