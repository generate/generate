'use strict';

var path = require('path');
var drafts = require('gulp-drafts');
var reflinks = require('gulp-reflinks');
var format = require('gulp-format-md');
var copy = require('copy');
var del = require('delete');
var paths = require('./lib/paths');
var lib = require('./lib');

module.exports = function(app) {
  var dest = paths.site();
  app.use(lib.middleware());
  app.use(lib.common());

  app.task('clean', function(cb) {
    del(paths.docs(), {force: true}, cb);
  });

  app.task('copy', function(cb) {
    copy('*.png', paths.docs(), cb);
  });

  app.task('docs', ['clean', 'copy'], function(cb) {
    app.layouts('docs/layouts/*.md', {cwd: paths.cwd()});
    app.docs('docs/*.md', {cwd: paths.cwd(), layout: 'default'});

    return app.toStream('docs')
      .pipe(drafts())
      .pipe(app.renderFile('*'))
      .pipe(reflinks())
      .pipe(format())
      .pipe(app.dest(paths.docs()));
  });

  app.task('default', ['docs']);
};
