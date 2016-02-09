'use strict';

var utils = require('../utils');

module.exports = function(app) {
  return function(val) {
    if (typeof app.option === 'function') {
      app.option(val);

    } else if (utils.typeOf(val) === 'object') {
      app.options = utils.extend({}, app.options, val);
      for (var key in val) {
        if (val.hasOwnProperty(key)) {
          app.emit('option', key, val[key]);
        }
      }
    }
  };
};
