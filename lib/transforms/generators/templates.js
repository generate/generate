'use strict';

var path = require('path');

/**
 * Load generators onto the `generators` object
 */

module.exports = function(app) {
  app.set('templates', app.get('generator.templates'));
};
