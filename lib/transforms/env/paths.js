'use strict';

/**
 * Prime the `data.paths` object
 */

module.exports = function paths_() {
  if (!this.has('data.paths')) {
    this.data({paths: {src: {}, dest: {}}});
  }
};
