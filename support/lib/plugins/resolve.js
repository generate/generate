'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(options) {
  return utils.through.obj(function(file, enc, next) {
    var stem = file.stem;
    var idx = stem.indexOf('.');

    var dir = '';
    if (idx !== -1) {
      dir = stem.slice(0, idx);
      stem = stem.slice(idx + 1);
    }

    file.stem = stem;
    file.dirname = path.join(file.dirname, dir);
    next(null, file);
  })
};
