'use strict';

var resolveUp = require('resolve-up');
var path = require('path');
var _ = require('lodash');

/**
 * Load generators onto the `generators` object
 */

module.exports = function generators_() {
  this.generators = this.generators || {};
  var pattern = this.option('generator pattern') || 'generate-*';

  _.transform(resolveUp(pattern), function (acc, dir) {
    var pkg = require(path.resolve(dir, 'package.json'));
    if (!pkg.main) return acc;

    var fp = path.resolve(dir, pkg.main);
    var res = {};
    res.module = require.resolve(path.resolve(fp));
    res.pkg = pkg;
    var name = pkg.name.split('generate-').join('');
    acc[name] = res;
  }, this.generators);
};
