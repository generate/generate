'use strict';

/**
 * Create built-in template types, using the `base` loader
 */

module.exports = function create_() {
  this.create('include', {isRenderable: true}, ['base']);
  this.create('dotfile', {isRenderable: true}, ['base']);
};
