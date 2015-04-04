'use strict';

var utils = require('../../utils');
var cache = require('../../cache');

/**
 * Called in the `init` transform. A read-only copy of this data is also
 * stored on `generate.env`
 */

module.exports = function pkg_() {
  var filename = this.option('config') || 'package.json';

  this.data(filename, function (fp) {
    return cache[fp] || (cache[fp] = utils.tryRequire(fp));
  });
};
