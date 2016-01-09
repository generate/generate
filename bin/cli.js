#!/usr/bin/env node

var path = require('path');
var utils = require('../lib/utils');
var Env = require('../lib/env');

// parse argv (TODO: yargs!)
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    help: 'h',
    verbose: 'v'
  }
});

/**
 * Run generate
 */

function run(cb) {
  // pre-process command line arguments
  var args = utils.expandArgs(argv);

  var baseEnv = createEnv(path.resolve(__dirname, '..'));
  var Generate = require(baseEnv.module.path);

  var base = new Generate();
  base.env = baseEnv;
  base.fn = baseEnv.config.fn;
  base.option(args);

  var env = createEnv(process.cwd());
  var config = env.config.fn;
  var app = null;

  // If true, we have an instance of `Generate`
  if (utils.isObject(config) && config.isGenerate) {
    app = config;
    app.env = env;
    app.option(args);
    app.register('base', base, env);

  // If true, we have a "generator" function
  } else {
    app = new Generate();
    app.env = env;
    app.option(args);
    app.register('base', base, env);

    // register local `generator.js` if it exists
    if (typeof config === 'function') {
      app.fn = config;
      app.register(env.config.alias, config, env);
    }
  }

  /**
   * Support `--emit` for debugging
   * Examples:
   *
   *   # emit views as they're loaded
   *   $ --emit view
   *
   *   # emit errors
   *   $ --emit error
   */

  if (args.emit && typeof args.emit === 'string') {
    app.on(args.emit, console.log.bind(console));
  }

  /**
   * Listen for generator configs, and register them
   * as they're emitted
   */

  app.env.on('config', function(name, env) {
    app.register(name, env.config.fn, env);
  });

  app.env.resolve('generate-*/generator.js', {
    cwd: utils.gm
  });

  cb(null, app);
}

/**
 * Run generators and their tasks
 */

run(function(err, app) {
  if (err) throw err;

  app.on('error', function(err) {
    console.error(err);
  });

  app.build(argv, function(err, cb) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    utils.timestamp('finished');
    process.exit(0);
  });
});

function createEnv(cwd) {
  var env = new Env('generator.js', 'generate', cwd);;
  env.module.path = utils.tryResolve('generate');
  return env;
}
