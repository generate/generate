'use strict';

/**
 * Load templates for built-in template types.
 */

module.exports = function(app) {
  app.includes('**/*.*', { cwd: app.get('templates')});
  app.dotfiles('**/_*', { cwd: app.get('templates')});
};
