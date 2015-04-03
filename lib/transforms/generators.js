'use strict';

var path = require('path');
var resolveUp = require('resolve-up');
var reduce = require('lodash')._.reduce;

/**
 * Load generators onto the `generators` object
 */

module.exports = function generators_() {
  this.generators = this.generators || {};
  var pattern = this.option('generator pattern') || 'generate-*';

  reduce(resolveUp(pattern), function (acc, dir) {
    var json = require(path.resolve(dir, 'package.json'));
    if (!json.main) return acc;

    var fp = path.resolve(dir, json.main);
    acc[path.basename(dir)] = require(path.resolve(fp));
    return acc;
  }, this.generators);
};
