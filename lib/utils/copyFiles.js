'use strict';

var path = require('path');
var copy = require('./copy');

module.exports = function copyFiles(files, dest) {
  for (var i = files.length - 1; i >= 0; i--) {
    var fp = files[i];
    copy(fp, path.join(dest, path.basename(fp)));
  }
};
