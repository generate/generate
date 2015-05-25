'use strict';

/**
 * Initialize built-in template types with
 * the `base` loader.
 */

module.exports = function() {
  this.create('include', {isRenderable: true}, ['base']);
  this.create('dotfile', {isRenderable: true}, ['base']);
};
