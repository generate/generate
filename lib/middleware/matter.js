'use strict';

var parser = require('parser-front-matter');

/**
 * Default middleware for parsing front-matter
 */

module.exports = function (file, next) {
  return parser.parse(file, function (err, res) {
    if (err) return next(err);
    file = res;
    next();
  });
};
