'use strict';

/**
 * Transform for loading default sync helpers
 */

module.exports = function(app) {
  app.helper('date', require('helper-date'));
};
