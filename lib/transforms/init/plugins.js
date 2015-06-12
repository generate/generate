'use strict';

var render = require('template-render');
var paths = require('gulp-dest-paths');
var init = require('template-init');
var vfs = require('vinyl-fs');
var plugins = require('../../plugins');

/**
 * Prime the `plugins` object and enable default plugins.
 */

module.exports = function(app) {
  app.plugins = app.plugins || {};

  app.plugin('init', init(app));
  app.plugin('lint', plugins.lint(app));
  app.plugin('paths', paths);
  app.plugin('render', render(app));
  app.plugin('src', vfs.src);
  app.plugin('dest', vfs.dest);
};
