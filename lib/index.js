'use strict';

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` so we can fool browserify
 * into recognizing lazy deps.
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 * (here, `require` is actually lazy-cache)
 */

require('async');
require('dest');
require('base-methods', 'Base');
require('stream-combiner', 'combiner');
require('mixin-deep', 'merge');
require('stream-loader', 'loader');
require('through2', 'through');
require('write', 'writeFile');

/**
 * Reset require
 */

require = fn;

/**
 * Creates a pipeline from user-defined plugins passed on
 * `options.pipeline` and returns a function that thenk.
 *
 * @param {Array} Array of plugins.
 * @return {Stream}
 */

utils.combine = function(app, pipeline) {
  return function(stream, opts) {
    return utils.combiner([stream, app.pipeline(pipeline, opts)]);
  };
};

/**
 * Expose utils
 */

module.exports = utils;
