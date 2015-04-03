'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var rename = require('./rename');

module.exports = function move(src, dest, force) {
  var dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }
  rename(src, dest, force);
};
