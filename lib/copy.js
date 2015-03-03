'use strict';

var fs = require('fs');

module.exports = function copy(src, dest) {
  var res = fs.createWriteStream(dest);
  fs.createReadStream(src).pipe(res);
};
