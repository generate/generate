'use strict';

var path = require('path');
var utils = require('../../utils');

module.exports = function(app, base) {
  return function(cb) {
    utils.async.eachOf(base.generators, function(generator, name, next) {
      generator.build('templates', next);
    }, cb);
  };
};
