'use strict';

var plugins = require('lazy-cache')(require);
var fn = require;
require = plugins; // eslint-disable-line

/**
 * Plugins
 */

require('assemble-loader', 'loader');
require('base-cli-process', 'cli');
require('base-config-process', 'config');
require('base-fs-rename', 'rename');
require('base-generators', 'generators');
require('base-npm', 'npm');
require('base-runtimes', 'runtimes');
require('base-pipeline', 'pipeline');
require('base-questions', 'questions');
require('base-store', 'store');
require = fn; // eslint-disable-line

/**
 * Expose plugins
 */

module.exports = plugins;
