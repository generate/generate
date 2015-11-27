'use strict';

var Generate = require('./');
var generate = new Generate();
var argv = require('minimist')(process.argv.slice(2), {
  alias: {verbose: 'v'}
});

generate.on('error', function(err) {
  if (argv.verbose) console.error(err);
});

generate.on('log', function(err) {
  if (argv.verbose) console.log(err);
});

generate.generator('foo', function(app, base, env) {
  app.task('a', function() {});
  app.task('b', function() {});
  throw new Error('uh oh!');
});

generate.generator('bar', function(app, base, env) {
  app.task('a', function(cb) {
    base.emit('log', 'bar > a');
    cb();
  });
});

generate.generator('baz', function(app, base, env) {
  base.runGenerators('bar:a', function(err) {
    if (err) return console.log(err);
    base.emit('log', 'done!');
  });
});

