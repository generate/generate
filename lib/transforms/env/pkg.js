'use strict';

var path = require('path');
var utils = require('../../utils');
var cache = require('../../cache');

/**
 * Called in the `init` transform, Merges data from `package.json`
 * with `cache.data` if a `package.json` file exists.
 */

module.exports = function pkg_() {
  var fp = 'package.json';
  this.set('package', cache[fp] || (cache[fp] = utils.tryRequire(fp)) || {});
};
