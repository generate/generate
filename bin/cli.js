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

function run(cb) {
  var baseEnv = createEnv(path.resolve(__dirname, '..'));
  var Generate = require(baseEnv.module.path);

  // pre-process command line arguments
  var args = utils.expandArgs(argv);

  var base = new Generate();
  base.env = baseEnv;
  base.fn = baseEnv.config.fn;
  base.option(args);

  var env = createEnv(process.cwd());
  var config = env.config.fn;
  var app = null;

  // we have an instance of `Generate`
  if (utils.isObject(config) && config.isGenerate) {
    app = config;
    app.env = env;
    app.option(args);
    app.register('base', base.fn, env);
    app.parent = base;

  // we have a "generator" function
  } else {
    app = new Generate();
    app.env = env;
    app.option(args);
    app.register('base', base.fn, env);
    app.parent = base;

    // register local `generator.js` if it exists
    if (typeof config === 'function') {
      app.fn = config;
      app.register(env.config.alias, config, env);
    }
  }

  /**
   * Support `--emit` for debugging
   *
   * Example:
   *   $ --emit data
   */

  if (args.emit && typeof args.emit === 'string') {
    app.on(args.emit, console.log.bind(console));
  }

  /**
   * Listen for generator configs, and register them
   * as they're emitted
   */

  app.env.on('config', function(name, env) {
    app.registerPath(name, env.config.path, env);
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
