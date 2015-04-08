'use strict';

/**
 * Called in the `init` transform, this merge's global
 * user data, and project config with `cache.data`.
 *
 *   1. Merge the user's global data store with `cache.data`
 *   2. Merge the local project's config store with `cache.data`
 */

module.exports = function data_() {
  this.data(this.store.data);
  this.data(this.config.data);
};
