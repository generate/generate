'use strict';

var Store = require('data-store');

/**
 * Create a local config store for project-specific values.
 */

module.exports = function config_() {
  this.config = new Store('generate:' + this.get('data.appname'));
};
