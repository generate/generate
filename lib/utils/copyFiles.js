'use strict';

var path = require('path');
var copy = require('./copy');

module.exports = function copyFiles(files, dest) {
  for (var i = 0; i < files.length; i++) {
    var fp = files[i];
    copy(fp, path.join(dest, path.basename(fp)));
  }
};
