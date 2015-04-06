'use strict';

var path = require('path');

/**
 * Get/set the current the current generator's
 * template directory.
 *
 * ```js
 * console.log(generator.templates);
 * //=> /templates/
 * ```
 * Or set:
 *
 * ```js
 * generator.templates = 'templates';
 * ```
 */

module.exports = function templates_() {
  var templates = (this.cwd ? this.cwd : process.cwd()) + '/templates';

  Object.defineProperty(this, 'templates', {
    get: function () {
      return path.resolve(templates);
    },
    set: function (val) {
      templates = val;
    }
  });
};
