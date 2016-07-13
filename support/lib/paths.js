'use strict';

var path = require('path');
var base = path.resolve(__dirname, '..');
exports.cwd = require('memoize-path')(base);
exports.memo = require('memoize-path')(base);

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
