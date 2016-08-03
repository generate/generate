'use strict';

var path = require('path');
var base = path.resolve(__dirname, '../..');
var build = module.exports;
build.paths = {};

build.paths.cwd = require('memoize-path')(base);
build.paths.memo = require('memoize-path')(base);

build.paths.docs = function(fp) {
  var res = build.paths.memo('../docs')(fp);
  return fp ? res() : res;
};

build.paths.site = function(fp) {
  var res = build.paths.memo('../_gh_pages')(fp);
  return fp ? res() : res;
};

build.paths.tmpl = function(fp) {
  var res = build.paths.memo('templates')(fp);
  return fp ? res() : res;
};
