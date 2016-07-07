'use strict';

var path = require('path');
var copy = require('copy');
var del = require('delete');
var drafts = require('gulp-drafts');
var reflinks = require('gulp-reflinks');
var format = require('gulp-format-md');
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

  app.task('reflinks', function(cb) {
    app.pkg.union('verb.reflinks', app.cache.reflinks || []);
    app.pkg.logInfo('updated package.json with:', {reflinks: app.cache.reflinks || []});
    app.pkg.save();
    cb();
  });

  app.task('docs', ['clean', 'copy'], function(cb) {
    app.layouts('docs/layouts/*.md', {cwd: paths.cwd()});
    app.docs('docs/*.md', {cwd: paths.cwd(), layout: 'default'});

    return app.toStream('docs')
      .pipe(drafts())
      .pipe(app.renderFile('*'))
      .pipe(format())
      .pipe(reflinks())
      .pipe(app.dest(function(file) {
        app.union('cache.reflinks', file._reflinks);
        return paths.docs();
      }));
  });

  app.task('default', ['docs', 'reflinks']);
};
