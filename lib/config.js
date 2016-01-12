'use strict';

var settings = require('./settings');
var utils = require('./utils');

/**
 * Custom extensions to the built-in mappings
 * provided by the `base-config` plugin.
 */

module.exports = function(options) {
  return function(app) {
    if (!app.config) {
      app.use(utils.config());
    }

    app.config
      .map('data', function(val) {
        app.data(val);
      })
      .map('options', function(val) {
        app.option(val);
      })
      .map('ignore', function(val) {
        app.ignore(val);
      })
  };
};
