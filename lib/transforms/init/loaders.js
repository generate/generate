'use strict';

var loaders = require('../../loaders');

/**
 * Load built-in loaders
 */

module.exports = function base_() {
  this.loader('base', [loaders.base]);
  this.loader('task', [loaders.task]);
};
