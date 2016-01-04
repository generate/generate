'use strict';

var utils = require('../utils');

module.exports = function(app) {
  return function(val) {
    app.store.config.set(val);
    val = utils.tableize(val);
    console.log('saved > "%j" %s', val, 'in global config store.');
  };
};
