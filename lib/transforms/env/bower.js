'use strict';

var utils = require('../../utils');
var cache = require('../../cache');

/**
 * Called in the `init` transform, adds a `bower` object to
 * `cache.data` if a `bower.json` file exists.
 */

module.exports = function bower_() {
  var fp = 'bower.json';
  this.set('bower', cache[fp] || (cache[fp] = utils.tryRequire(fp)));
};
