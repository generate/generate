'use strict';

/**
 * Load built-in engines
 */

module.exports = function(app) {
  app.engine('*', require('engine-lodash'));
};
