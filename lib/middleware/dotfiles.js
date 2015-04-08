'use strict';

var path = require('path');

/**
 * Rename dotfile templates.
 */

module.exports = function dotfiles_(file, next) {
  if (file.path.indexOf('templates/dotfiles') !== -1) {
    var dirname = path.dirname(file.path);
    var basename = '.' + path.basename(file.path);
    file.path = path.join(dirname, basename);
  }
  next();
};
