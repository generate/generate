'use strict';

var path = require('path');
var utils = require('./utils');

/**
 * Common directories to ignore
 */

var exclusions = [
  '.git',
  'actual',
  'coverage',
  'expected',
  'fixtures',
  'node_modules',
  'temp',
  'templates',
  'test/actual',
  'test/fixtures',
  'tmp',
  'vendor',
  'wip'
];

/**
 * Convert gitignore to an array of glob patterns
 */

exports.gitignore = function(cwd) {
  var arr = ignores(cwd).map(function(pattern) {
    return exports.toGlob(pattern);
  });
  return utils.unique(arr);
};

/**
 * Convert an array of `gitignore` patterns (git uses wildmatch) to
 * close-enough approximations of glob-style patterns.
 */

exports.toGlobs = function(patterns) {
  return utils.arrayify(patterns).map(exports.toGlob);
};

/**
 * Convert a `gitignore` pattern (git uses wildmatch) to
 * a close-enough approximation of a glob-style pattern.
 */

exports.toGlob = function(pattern) {
  pattern = pattern.replace(/^[*]{2}|[*]{2}$/, '');
  pattern = pattern.replace(/^\/|\/$/, '');
  return '**/' + pattern + '/**';
};

/**
 * Directories to exclude in the search
 */

function ignores(cwd) {
  return gitignore('.gitignore', cwd)
    .concat(exclusions)
    .sort();
}

/**
 * Parse the local `.gitignore` file and add
 * the resulting ignore patterns.
 */

function gitignore(fp, cwd) {
  fp = path.resolve(cwd, fp);
  if (!utils.exists(fp)) {
    return [];
  }
  return utils.parseGitignore(fp);
}
