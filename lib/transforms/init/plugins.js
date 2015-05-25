'use strict';

/**
 * Prime the `plugins` object
 */

module.exports = function(app) {
  app.plugins = app.plugins || {};
};
