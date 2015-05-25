'use strict';

var utils = require('../utils');

/**
 * Ensure that an `engine` id defined for rendering templates.
 */

module.exports = function(app) {
  var viewEngine = app.option('view engine');

  return function (file, next) {
    var engine = file.options.engine || file.ext || viewEngine;
    if (typeof engine === 'string') {
      file.options.engine = utils.formatExt(engine);
    }
    next();
  };
};
