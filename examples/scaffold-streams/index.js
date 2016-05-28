'use strict';

var through = require('through2');
var extname = require('gulp-extname');
var Generate = require('../..');
var app = new Generate();

app.on('error', function(err) {
  console.log(err);
});

var Scaffold = require('scaffold');
var scaffold = new Scaffold();

scaffold.addTargets({
  a: {
    options: {
      data: {title: 'Markdown'},
      cwd: 'templates',
      flatten: true,
      destBase: __dirname + '/site/one',
      pipeline: ['render', 'extname']
    },
    files: [
      {src: '*.hbs', dest: 'a', options: {pipeline: ['foo', 'bar', 'render', 'extname']}},
      {src: '*.hbs', dest: 'b'},
      {src: '*.hbs', dest: 'c'},
      {src: '*.md', dest: 'd', data: {title: 'Foo'}},
    ]
  },
  b: {
    options: {
      data: {title: 'Baz'},
      cwd: 'templates',
      flatten: true,
      destBase: __dirname + '/site/two',
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

app.plugin('render', app.renderFile);
app.plugin('extname', extname);

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

app.scaffoldStream(scaffold)
  .on('error', console.error)
  .on('data', console.log)
  .on('end', function() {
    console.log('done!');
  });
