'use strict';

var through = require('through2');
var utils = require('../utils');

module.exports = function(app) {
  return through.obj(function (file, enc, cb) {
    utils.lint(app, file);
    this.push(file);
    return cb();
  });
};
