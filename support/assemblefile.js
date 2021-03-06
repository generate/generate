'use strict';

var del = require('delete');
var assemble = require('assemble');
var app = module.exports = assemble();

/**
 * Local dependencies
 */

var pipeline = require('./build/pipeline');
var config = require('./build/config');

/**
 * Load build config (returns build paths)
 */

var paths = config(app, __dirname);

/**
 * Clean out dest on re-buid
 */

app.task('clean', function() {
  return del(paths.dest(), {force: true});
});

/**
 * Load templates
 */

app.task('templates', function(cb) {
  app.partials(paths.src('templates/partials/*.hbs'));
  app.layouts(paths.src('templates/layouts/*.hbs'));
  app.pages(paths.src('pages/*.md'));
  cb();
});

/**
 * Root site files
 */

app.task('root', function() {
  return app.src(paths.src('root/*'), {dot: true})
    .pipe(app.renderFile('*'))
    .pipe(app.dest(paths.dest()));
});

/**
 * Copy assets
 */

app.task('assets', function() {
  return app.copy(paths.src('assets/**/*'), paths.dest('assets'), {dot: true});
});

/**
 * Convert sass and write .css files
 */

app.task('css', function() {
  return app.src('src/sass/**/*.scss')
    .pipe(pipeline.sass({outputStyle: 'expanded'})
      .on('error', pipeline.sass.logError))
    .pipe(app.dest(paths.assets('css')));
});

/**
 * Render templates and write .html files
 */

app.task('html', ['templates'], function() {
  app.data('sitemap', app.store.get('site'));
  app.data('site', app.store.get('site'));

  return app.toStream('pages')
    .pipe(pipeline.extname())
    .pipe(pipeline.drafts())
    .pipe(pipeline.reflinks())
    .pipe(pipeline.markdown())
    .pipe(pipeline.markdown.unescape())
    .pipe(app.sitemap())
    .pipe(app.renderFile())
    .pipe(pipeline.toc({
      parentLink: false,
      selectors: 'h2,h3',
      id: '#navigation'
    }))
    .pipe(app.dest(paths.dest()));
});

/**
 * Build
 */

app.task('default', ['clean', 'css', 'html', 'root', 'assets']);
