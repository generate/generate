'use strict';

/**
 * Expose the task `session` on generate
 */

module.exports = function session_() {
  this.session = require('../../session');
};
