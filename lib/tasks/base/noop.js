'use strict';

var utils = require('../../utils');

module.exports = function(app, base, env) {
  return function (cb) {
    return cb();
  };
};
