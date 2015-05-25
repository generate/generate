'use strict';

var path = require('path');

/**
 * Sets App's package.json data on `app.metadata`.
 * Called in the `init` transform.
 */

module.exports = function(app) {
  Object.defineProperty(app, 'metadata', {
    get: function () {
      return require(path.resolve(__dirname, '../..', 'package.json'));
    },
    set: function () {
      console.log('`app.metadata` is read-only and should not be modified.');
    }
  });
};
