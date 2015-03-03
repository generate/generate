'use strict';

var path = require('path');
var rename = require('./rename');
var mkdir = require('./mkdir');

module.exports = function move(src, dest, force) {
  var dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    mkdir(dir);
  }
  rename(src, dest, force);
};