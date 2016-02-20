#!/usr/bin/env node

process.env.GENERATE_CLI = true;
var generator = require('../lib/generators');
var generate = require('..');

/**
 * Create the generator "runner"
 */

var run = generate.runner('generator.js', generator);
var app = generate();

app.on('done', function() {
  process.exit(0);
});

/**
 * Run generators and tasks
 */

run(app, function(err, argv, app) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  app.emit('done');
});
