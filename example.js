'use strict';

var Generate = require('./');
var generate = new Generate();

generate.on('error', function(err) {
  console.log(err);
});

generate.generator('foo', function(app, base, env) {
  app.task('a', function() {});
  app.task('b', function() {});
  throw new Error('uh oh!')
});

generate.generator('bar', function(app, base, env) {
  app.task('a', function() {});
  app.task('b', function() {});
});

generate.generator('baz', function(app, base, env) {
  // console.log(base)
});

