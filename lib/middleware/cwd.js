'use strict';

/**
 * Prime the `file` object with properties that
 * can be extended in plugins.
 */

module.exports = function cwd_(generate) {
  return function (file, next) {
    file.cwd = file.data.cwd || generate.cwd || file.cwd || '.';
    next();
  };
};
