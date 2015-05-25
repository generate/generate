'use strict';

/**
 * Prime `app.cache.argv`
 */

module.exports = function(app) {
  app.cache.argv = app.cache.argv || [];
};
