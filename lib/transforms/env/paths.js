'use strict';

/**
 * Prime the `data.src` and `data.dest` objects. Paths
 * are exposed on the `data` object (instead of `project` etc.)
 * so they can be used in templates.
 */

module.exports = function() {
  this.cache.data.src = this.cache.data.src || {};
  this.cache.data.dest = this.cache.data.dest || {};
};
