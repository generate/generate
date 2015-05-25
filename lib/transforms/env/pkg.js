'use strict';

var utils = require('../../utils');
var cache = {};

/**
 * Called in the `init` transform, Merges data from `package.json`
 * with `cache.data` if a `package.json` file exists.
 */

module.exports = function(app) {
  var fp = 'package.json';
  app.set('package', cache[fp] || (cache[fp] = utils.tryRequire(fp)) || {});
};
