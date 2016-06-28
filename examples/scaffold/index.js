'use strict';

var path = require('path');
var through = require('through2');
var extname = require('gulp-extname');
var scaffold = require('generate-scaffold');
var extend = require('extend-shallow');
var parser = require('parser-front-matter');
var Generate = require('../..');
var dest = path.resolve.bind(path, __dirname);
var app = new Generate();
app.use(scaffold());

app.onLoad(/./, function(file, next) {
  parser.parse(file, next);
});

app.on('error', function(err) {
  console.log(err);
});

var Scaffold = require('scaffold');
var config = new Scaffold({
  a: {
    options: {
      title: 'Markdown',
      cwd: dest('templates'),
      flatten: true,
      destBase: dest('site/one'),
      pipeline: ['render', 'extname', 'foo', 'bar']
    },
    files: [
      {src: '*.hbs', dest: 'a', options: {pipeline: ['foo', 'bar', 'render', 'extname']}},
      {src: '*.hbs', dest: 'b'},
      {src: '*.hbs', dest: 'c'},
      {src: '*.md', dest: 'd', title: 'Foo'},
    ]
  },
  b: {
    options: {
      title: 'Baz',
      cwd: dest('templates'),
      flatten: true,
      destBase: dest('site/two'),
      pipeline: app.renderFile
    },
    files: [
      {src: '*.hbs', dest: 'a'},
      {src: '*.hbs', dest: 'b'},
      {src: '*.hbs', dest: 'c'},
      {src: '*.md', dest: 'd', data: {title: 'Bar'}},
    ]
  }
});

/**
 * Site data
 */

app.data({
  site: {
    title: 'My Blog!'
  }
});

/**
 * Register pipeline plugins (can be gulp plugins)
 */

app.plugin('extname', extname);
app.plugin('render', app.renderFile);

/**
 * Custom pipeline plugins
 */

app.plugin('foo', function(options) {
  return through.obj(function(file, enc, next) {
    file.content += '\nfoo';
    next(null, file);
  });
});

app.plugin('bar', function(options) {
  return through.obj(function(file, enc, next) {
    file.content += '\nbar';
    next(null, file);
  });
});

/**
 * Register engines
 */

app.engine('hbs', require('engine-handlebars'));
app.engine('md', require('engine-base'));

/**
 * Generate scaffold
 */

app.scaffold('example', config)
  .generate(function(err) {
    if (err) throw err;
    console.log('done!');
  });
