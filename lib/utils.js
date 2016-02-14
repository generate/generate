'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Utils
 */

require('extend-shallow', 'extend');
require('global-modules', 'gm');
require('is-affirmative', 'is');
require('matched', 'glob');
require = fn;

/**
 * Expose utils
 */

module.exports = utils;
