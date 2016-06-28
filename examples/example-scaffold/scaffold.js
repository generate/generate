'use strict';

var Generate = require('../..');
var generate = new Generate();
generate.use(require('generate-scaffold')());

var Scaffold = require('scaffold');
var scaffold = new Scaffold({
  a: {
    options: {
      cwd: 'examples/example-scaffold/fixtures',
      destBase: 'examples/example-scaffold/actual/two',
    },
    data: {name: 'Jon'},
    files: [
      {src: '*.txt', dest: 'a'},
      {src: '*.txt', dest: 'b'},
      {src: '*.txt', dest: 'c'},
      {src: '*.md', dest: 'md', data: {name: 'Jon'}},
    ]
  },
  b: {
    cwd: 'examples/example-scaffold/fixtures',
    destBase: 'examples/example-scaffold/actual/one',
    data: {name: 'Brian'},
    files: [
      {src: '*.txt', dest: 'a'},
      {src: '*.txt', dest: 'b'},
      {src: '*.txt', dest: 'c'},
      {src: '*.md', dest: 'md', data: {name: 'Brian'}},
    ]
  }
});

generate.scaffold('example', scaffold)
  .generate(function(err) {
    if (err) return console.log(err);
    console.log('done!');
  });
