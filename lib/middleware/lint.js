'use strict';

var utils = require('../utils');

/**
 * Lint `file.content` for missing helpers
 * or data properties.
 */

module.exports = function (app) {
  return function(file, next) {
    utils.lint(app, file);
    next();
  };
};
