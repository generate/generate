'use strict';

var utils = require('../utils');

module.exports = function(app, env) {
  return function (cb) {
    return cb();
  };
};
