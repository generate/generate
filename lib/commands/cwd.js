'use strict';

var path = require('path');

module.exports = function(app) {
  return function(dir) {
    var cwd = path.resolve(dir);
    if (cwd !== process.cwd()) {
      process.chdir(cwd);
      cwd = process.cwd();
    }
    app.option('cwd', cwd);
  };
};
