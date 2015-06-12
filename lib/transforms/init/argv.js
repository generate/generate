'use strict';

/**
 * Prime the `app.cache.argv` object. Used for getting/setting values
 * that are passed from the command line.
 */

module.exports = function(app) {
  app.cache.argv = app.cache.argv || [];
};
