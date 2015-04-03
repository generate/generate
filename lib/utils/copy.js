'use strict';

var fs = require('fs');

module.exports = function copy(src, dest) {
  fs.createReadStream(src).pipe(fs.createWriteStream(dest));
};
