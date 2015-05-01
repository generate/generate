'use strict';

/**
 * Transform for loading default sync helpers
 */

module.exports = function sync_(app) {
  app.helper('date', require('helper-date'));
};
