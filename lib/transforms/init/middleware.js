'use strict';

var utils = require('../../utils');

/**
 * Initialize default middleware
 */

module.exports = function middleware_(verb) {
  verb.onLoad(/./, utils.series([
    require('../../middleware/props'),
    require('../../middleware/cwd')(verb),
    require('../../middleware/src'),
    require('../../middleware/dest'),
    require('../../middleware/dotfiles'),
  ]), function (err, file, next) {
    if (err) console.log(method, file, err);
    next();
  });
};
