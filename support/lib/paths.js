'use strict';

var path = require('path');
exports.cwd = require('memoize-path')(path.resolve(__dirname, '..'));
exports.memo = require('memoize-path')(path.resolve(__dirname, '..'));

exports.docs = function(fp) {
  var res = exports.memo('../docs')(fp);
  return fp ? res() : res;
};

exports.site = function(fp) {
  var res = exports.memo('../_gh_pages')(fp);
  return fp ? res() : res;
};

exports.tmpl = function(fp) {
  var res = exports.memo('templates')(fp);
  return fp ? res() : res;
};
