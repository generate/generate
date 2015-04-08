'use strict';

var utils = require('../../utils');
var cache = require('../../cache');

/**
 * Called in the `init` transform, adds a `bower` object to
 * `cache.data` if a `bower.json` file exists.
 *
 * A read-only copy of this data is also stored on `generate.env`
 */

module.exports = function bower_() {
  var filename = this.option('bower') || 'bower.json';

  this.data(filename, function (fp) {
    return cache[fp] || (cache[fp] = utils.tryRequire(fp)) || {};
  });
};
