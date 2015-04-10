'use strict';

/**
 * Load built-in engines
 */

module.exports = function engines_() {
  this.engine('*', require('engine-lodash'));
};
