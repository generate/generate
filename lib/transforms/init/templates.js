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
  var templates = this.get('templates');

  Object.defineProperty(this, 'templates', {
    configurable: true,
    get: function () {
      return path.resolve(templates);
    },
    set: function (val) {
      templates = val;
    }
  });
};
