'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line

/**
 * Utils
 */

require('extend-shallow', 'extend');
require('mixin-deep', 'merge');
require('get-value', 'get');
require('global-modules', 'gm');
require('is-affirmative', 'is');
require('matched', 'glob');
require = fn; // eslint-disable-line

/**
 * Expose utils
 */

module.exports = utils;
