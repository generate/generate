#!/usr/bin/env node

process.env.GENERATE_CLI = true;

var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var runner = require('base-runner');
var commands = require('../lib/commands');
var Generate = require('..');

// lift-off options
var options = {
  name: 'generate',
  runner: require('../package'),
  configName: 'generator',
  moduleParentId: path.resolve(__dirname, '..'),
  lookup: lookup
};

/**
 * Initialize Generate CLI
 */

runner(Generate, options, argv, function(err, app, runnerContext) {
  if (err) handleError(app, err);

  /**
   * Set `argv` on app.options
   */

  app.option(argv);

  /**
   * Load custom commands
   */

  commands(app, runnerContext);

  /**
   * runnerContext
   */

  // get the config object from package.json
  var config = app.pkg.get(runnerContext.env.name);
  if (config && !args.noconfig) {
    app.set('cache.config', config);
  }

  // set parsed and unparsed argv on `cache`
  var args = app.argv(runnerContext.argv);
  app.set('cache.argv', {
    orig: argv,
    parsed: runnerContext.argv,
    processed: args
  });

  /**
   * Custom lookup function for resolving generators
   */

  app.option('runner.new', 'files');

  /**
   * Process argv
   */

  app.cli.process(args, function(err) {
    if (err) handleError(app, err);
    app.emit('done');
    process.exit();
  });
});

/**
 * Custom lookup function for resolving generators
 */

function lookup(app) {
  return function(key) {
    var patterns = [`generate-${key}`];
    if (/generate-/.test(key)) {
      patterns.push(key);
    }
    return patterns;
  }
}

function handleError(app, err) {
  if (app && app.handleError) {
    app.handleError(err);
  } else {
    console.error(err.stack);
    process.exit(1);
  }
}
