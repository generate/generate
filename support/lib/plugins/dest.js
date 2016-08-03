'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(options) {
  return utils.through.obj(function(file, enc, next) {
    next(null, file);
  })
};
