#!/usr/bin/env node

process.env.GENERATE_CLI = true;

var argv = require('minimist')(process.argv.slice(2));
var runner = require('base-runner');
var commands = require('../lib/commands');
var Generate = require('..');

// lift-off options
var options = {
  name: 'generate',
  runner: require('../package'),
  configName: 'generator'
};

/**
 * Initialize Generate CLI
 */

runner(Generate, options, argv, function(err, app, runnerContext) {
  if (err) app.handleError(err);

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

  app.option('lookup', function(key) {
    var patterns = [`generate-${key}`];
    if (/generate-/.test(key)) {
      patterns.push(key);
    }
    return patterns;
  });

  app.option('runner.new', 'files');

  /**
   * Process argv
   */

  app.cli.process(args, function(err) {
    if (err) app.emit('error', err);
    app.emit('done');
    process.exit();
  });
});

