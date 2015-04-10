'use strict';

/**
 * Prime the `data.src` and `data.dest` objects. Paths
 * are exposed on the `data` object (instead of `project` etc.)
 * so they can be used in templates.
 */

module.exports = function paths_() {
  this.data({src: {}, dest: {}});
};
