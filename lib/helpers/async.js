'use strict';

var helper = require('async-helper-base');

/**
 * Transform for loading default async helpers
 */

module.exports = function async_(generate) {
  generate.asyncHelper('include', helper('include'));
};
