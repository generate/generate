'use strict';

var plugins = require('lazy-cache')(require);
var fn = require;
require = plugins; // eslint-disable-line

/**
 * Plugins
 */

require('assemble-loader', 'loader');
require('base-fs-rename', 'rename');
require('base-generators', 'generators');
require('base-runner', 'runner');
require('base-runtimes', 'runtimes');
require('base-pipeline', 'pipeline');
require('base-questions', 'ask');
require = fn; // eslint-disable-line

/**
 * Expose plugins
 */

module.exports = plugins;
