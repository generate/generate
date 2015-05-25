'use strict';

var path = require('path');

/**
 * Rename dotfile templates.
 */

module.exports = function(app) {
  var nodotfiles = app.isFalse('dotfiles');

  return function (file, next) {
    if (nodotfiles) return next();
    if (file.path.indexOf('templates/dotfiles') !== -1) {
      var dirname = path.dirname(file.path);
      var basename = path.basename(file.path);
      if (basename[0] !== '.') {
        basename = '.' + basename;
      }
      file.path = path.join(dirname, basename);
    }
    next();
  };
};
