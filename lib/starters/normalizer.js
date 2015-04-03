'use strict';

module.exports = function(file, fn) {
  file.contents = new Buffer(fn(file.contents.toString()));
};
