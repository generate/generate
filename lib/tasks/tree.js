'use strict';

var utils = require('../utils');

module.exports = function(app, env) {
  return function (cb) {
    console.log(utils.tree(env.base.generators));
    cb();
  }
};
