'use strict';

var path = require('path');
var copy = require('copy');
var del = require('delete');
var drafts = require('gulp-drafts');
var through = require('through2');
var layouts = require('gulp-layouts');
var reflinks = require('gulp-reflinks');
var format = require('gulp-format-md');
var plugins = require('./lib/plugins');
var common = require('./lib/common');
var build = require('./lib/build');
var utils = require('./lib/utils');
var lib = require('./lib');

module.exports = function(app) {
  var paths = build.paths;
  var md = new utils.Remarkable();

  app.use(require('verb-generate-readme'));
  app.use(common());

  app.option('engineOpts', {delims: ['<%', '%>']});
  app.engine('md', require('engine-base'));

  app.task('clean', function(cb) {
    del([paths.docs(), paths.site()], {force: true}, cb);
  });

  app.task('copy', function(cb) {
    copy('*.png', paths.docs(), cb);
  });

  app.task('reflinks', function(cb) {
    var reflinks = app.get('cache.reflinks') || [];
    if (reflinks.length > 1) {
      app.pkg.union('verb.reflinks', reflinks);
      app.pkg.save();
      app.pkg.logInfo('updated package.json with:', {reflinks: reflinks});
    }
    cb();
  });

  app.task('docs', ['clean', 'copy'], function(cb) {
    app.layouts('templates/layouts/*.{md,hbs}', {cwd: paths.cwd()});
    app.docs('templates/*.md', {cwd: paths.cwd()});
    return app.toStream('docs')
      .pipe(plugins.resolve())
      .pipe(plugins.paths())
      .pipe(plugins.anchors())
      .pipe(plugins.links())
      .pipe(drafts())
      .pipe(app.renderFile('md')).on('error', console.error)
      .pipe(reflinks())
      .pipe(format())
      .pipe(app.dest(function(file) {
        app.union('cache.reflinks', file._reflinks);
        file.layout = 'site.hbs';
        return paths.docs();
      }));
  });

  app.task('default', ['docs']);
};
