'use strict';

var _ = require('lodash');

/**
 * Called in the `init` transform. Merge the user's
 * global data store with project metadata.
 */

module.exports = function data_(generate) {
  this.cache.data = _.merge({}, this.cache.data, this.store.data);
};
