'use strict';

var path = require('path');
var utils = require('generator-util');
// var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Utils
 */

require('extend-shallow', 'extend');
require('global-modules', 'gm');
require('is-affirmative', 'is');
require('kind-of', 'typeOf');
require('matched', 'glob');
require('merge-settings', 'Settings');
require('mixin-deep', 'merge');
require('try-open');
require = fn;

utils.exists = function(filepath) {
  if (typeof filepath === 'undefined') {
    return false;
  }
  var val = utils.tryOpen(path.resolve(filepath), 'r');
  return typeof val === 'number';
};

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.renameKey = function(key, view) {
  return view ? view.basename : path.basename(key);
};

/**
 * Expose utils
 */

module.exports = utils;
