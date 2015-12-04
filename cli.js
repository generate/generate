#!/usr/bin/env node

var path = require('path');
var runner = require('base-runner');
var minimist = require('minimist');
var utils = require('./lib/utils');
var Generate = require('./');

// parse argv
var args = minimist(process.argv.slice(2), {
  alias: {verbose: 'v'}
});

// register `runner` as a mixin
Generate.mixin(runner('generate', 'generator'));

/**
 * Get the `base` instance of generate to use for
 * registering all other instances. This will either
 * be local to the user (e.g. `node_modules/generate`)
 * or a globally installed module
 */

var base = Generate.getConfig('generator.js', __dirname);

/**
 * Resolve config files (`generator.js`)
 */

base.resolve('generate-*/generator.js', {
    cwd: '@/'
  })
  .resolve('*/generator.js', {
    cwd: path.join(__dirname, 'fixtures')
  });

/**
 * Run generators and tasks
 */

base.cli.map('generators', function(generators) {
  if (!generators.length) {
    generators = [{base: ['default']}];
  }

  base.runGenerators(generators, function(err) {
    if (err) return console.error(err);
    utils.timestamp('done');
  });
});

/**
 * Process args
 */

base.cli.process(args);
