'use strict';

module.exports = function paths(file, verb) {
  var str = file.contents.toString();

  // do stuff to `file` and `verb`

  file.contents = new Buffer(str);
  return file;
};
