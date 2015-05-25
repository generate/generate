'use strict';

var parse = require('parse-filepath');
var path = require('path');

/**
 * Set properties on `file.data.src` to use in plugins,
 * other middleware, helpers, templates etc.
 */

module.exports = function(file, next) {
  var orig = file.options.originalPath;

  file.data.src = file.data.src || {};
  file.data.src.path = orig;

  // look for native node.js `path.parse` method first
  var parsed = typeof path.parse === 'function'
    ? path.parse(orig)
    : parse(orig);

  file.data.src.dirname = parsed.dir;
  file.data.src.relative = file.relative;
  file.data.src.filename = parsed.name;
  file.data.src.basename = parsed.base;
  file.data.src.extname = parsed.ext;
  file.data.src.ext = parsed.ext.slice(1);

  file.data.process = {};
  file.data.process.cwd = function () {
    return process.cwd();
  };

  file.data.resolve = path.resolve;
  next();
};
