'use strict';

var utils = require('../lib/utils');
var Generate = require('generate');
var app = new Generate();

var through = require('through2');
var Scaffold = require('scaffold');
var scaffold = new Scaffold({cwd: 'examples/fixtures'});

scaffold.addTargets({
  a: {
    options: {
      cwd: 'examples/fixtures',
      destBase: 'two',
      pipeline: ['foo']
    },
    data: {name: 'Jon'},
    files: [
      {src: '*.txt', dest: 'a', options: {pipeline: ['foo', 'bar']}},
      {src: '*.txt', dest: 'b'},
      {src: '*.txt', dest: 'c'},
      {src: '*.md', dest: 'md', data: {name: 'Jon'}},
    ]
  },
  b: {
    cwd: 'examples/fixtures',
    destBase: 'one',
    data: {name: 'Brian'},
    files: [
      {src: '*.txt', dest: 'a'},
      {src: '*.txt', dest: 'b'},
      {src: '*.txt', dest: 'c'},
      {src: '*.md', dest: 'md', data: {name: 'Brian'}},
    ]
  }
});

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

app.scaffold(scaffold, function(err) {
  if (err) throw err;
  utils.timestamp('finished');
});
