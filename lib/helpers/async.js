'use strict';

var helper = require('async-helper-base');

/**
 * Transform for loading default async helpers
 */

module.exports = function(app) {
  app.asyncHelper('include', helper('include'));
};
