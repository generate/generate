'use strict';

var lint = require('lint-templates');

/**
 * Lint `file.content` for missing helpers
 * or data properties.
 */

module.exports = function (app) {
  return function(file, next) {
    lint(app, file);
    next();
  };
};
