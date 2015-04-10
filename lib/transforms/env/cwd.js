'use strict';

var path = require('path');

/**
 * Get/set the current working directory
 *
 * ```js
 * console.log(generate.cwd);
 * //=> /dev/foo/bar/
 * ```
 * Or set:
 *
 * ```js
 * generate.cwd = 'foo';
 * ```
 */

module.exports = function cwd_() {
  var cwd = process.cwd();

  Object.defineProperty(this, 'cwd', {
    configurable: true,
    get: function () {
      return path.resolve(cwd);
    },
    set: function (val) {
      cwd = val;
    }
  });
};
