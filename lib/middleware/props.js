'use strict';

/**
 * Prime the `file` object with properties that
 * can be extended in plugins.
 */

module.exports = function(file, next) {
  file.contexts = file.contexts || {};
  file.options = file.options || {};
  file.locals = file.locals || {};
  file.data = file.data || {};
  next();
};
