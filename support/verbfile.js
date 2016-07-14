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
  app.preRender(/./, function(file, next) {
    if (typeof file.data.title !== 'string') {
      console.log('`title` missing in', file.path);
    }
    next();
  });

  app.task('clean', function(cb) {
    del(paths.docs(), {force: true}, cb);
  });

  app.task('copy', function(cb) {
    copy('*.png', paths.docs(), cb);
  });

  app.task('reflinks', function(cb) {
    var reflinks = app.get('cache.reflinks') || [];
    var diff = [];
    var len = reflinks.length;
    var idx = -1;
    while (++idx < len) {
      var reflink = reflinks[idx];
      if (/v?\d+\./.test(reflink)) {
        reflinks.splice(idx, 1);
        continue;
      }
      if (reflinks.indexOf(reflink) === -1) {
        diff.push(reflink);
      }
    }

    if (diff.length > 1) {
      app.pkg.union('verb.reflinks', diff);
      app.pkg.save();
      app.pkg.logInfo('updated package.json with:', {reflinks: diff});
    }
    cb();
  });

  app.task('docs', ['clean', 'copy'], function(cb) {
    app.layouts('templates/layouts/*.md', {cwd: paths.cwd()});
    app.docs('templates/*.md', {cwd: paths.cwd(), layout: 'default'});

    return app.toStream('docs')
      .pipe(drafts()).on('error', console.error)
      .pipe(app.renderFile('*')).on('error', console.error)
      .pipe(reflinks()).on('error', console.error)
      .pipe(format()).on('error', console.error)
      .pipe(app.dest(function(file) {
        app.union('cache.reflinks', file._reflinks);
        return paths.docs();
      }));
  });

  app.task('default', ['docs']);
};
