'use strict';

var Store = require('data-store');

/**
 * Create a local config store for storing
 * project-specific values.
 */

module.exports = function config_() {
  this.config = this.config || {};
  var appname = this.get('data.appname');

  if (!appname) {
    throw new Error('generate cannot resolve an `appname` for the current project.');
  }

  this.config[appname] = new Store(appname);
};
