'use strict';

var utils = require('../../utils');

/**
 * Initialize default middleware
 */

module.exports = function middleware_(generate) {
  generate.onLoad(/./, utils.series([
    require('../../middleware/props'),
    require('../../middleware/cwd')(generate),
    require('../../middleware/src'),
    require('../../middleware/dest'),
    require('../../middleware/dotfiles'),
  ]), function (err, file, next) {
    if (err) console.log(file.path, err);
    next();
  });
};
