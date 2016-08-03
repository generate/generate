'use strict';

var through = require('through2');

module.exports = function(options) {
  var cache = {files: [], paths: []};

  return through.obj(function(file, enc, next) {
    cache.files.push(file);
    cache.paths.push(file.relative);
    next();
  }, function(next) {
    var len = cache.files.length;
    var idx = -1;

    while (++idx < len) {
      var file = cache.files[idx];
      file.cache = cache;
      this.push(file);
    }
    next();
  });
};
