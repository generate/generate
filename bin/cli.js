#!/usr/bin/env node

var path = require('path');
var utils = require('../lib/utils');
var errors = require('./errors');
var generate = require('..');

var argv = require('minimist')(process.argv.slice(2), {
  alias: {help: 'h', verbose: 'v'}
});

function run(cb) {
  var cwd = process.cwd();
  var root = cwd;

  /**
   * Set the working directory
   */

  if (argv.cwd && cwd !== path.resolve(argv.cwd)) {
    process.chdir(argv.cwd);
    utils.timestamp('cwd changed to ' + utils.colors.yellow('~/' + argv.cwd));
  }

  /**
   * Create the base "generate" instance
   */

  var baseDir = path.resolve(__dirname, '..');
  var baseEnv = createEnv('generator.js', baseDir);

  // instantiate
  var base = generate();
  base.env = baseEnv;

  // set the generate function on the instance
  base.fn = require('../generator.js');

  /**
   * Get the generator.js to use
   */

  var generator = path.resolve(process.cwd(), 'generator.js');
  if (!utils.exists(generator)) {
    generator = path.resolve(__dirname, '../generator.js');
  }

  /**
   * Create the user's "generate" instance
   */

  var fn = require(generator);
  var env = createEnv('generator.js', process.cwd());
  var app;

  if (typeof fn === 'function') {
    app = generate();
    app.option(argv);
    app.env = env;
    app.fn = fn;
    fn.call(app, app, app, env);

  } else {
    app = fn;
    app.option(argv);
    app.env = env;
  }

  /**
   * Process command line arguments
   */

  var args = utils.processArgv(app, argv);
  app.set('argv', args);

  /**
   * Show path to generator
   */

  utils.logConfigfile(root, generator);

  /**
   * Support `--emit` for debugging
   *
   * Example:
   *   $ --emit data
   */

  if (argv.emit && typeof argv.emit === 'string') {
    app.on(argv.emit, console.error.bind(console));
  }

  /**
   * Listen for generator configs, and register them
   * as they're emitted
   */

  app.env.on('config', function(name, env) {
    app.register(name, env.config.fn, env);
  });

  /**
   * Resolve generate generators
   */

  app.env.resolve('generate-*/generator.js', {
    configfile: 'generator.js',
    cwd: utils.gm
  });

  cb(null, app);
}

/**
 * Run
 */

run(function(err, app) {
  if (err) handleError(err);

  if (!app) {
    process.exit(0);
  }

  /**
   * Listen for errors
   */

  app.on('error', function(err) {
    console.log(err);
  });

  /**
   * Run tasks
   */

  app.build(argv, function(err) {
    if (err) throw err;
    utils.timestamp('finished');
    process.exit(0);
  });
});

/**
 * Creat a new `env` object
 */

function createEnv(configfile, cwd) {
  var env = new generate.Env(configfile, 'generate', cwd);;
  env.module.path = utils.tryResolve('generate');
  return env;
}

/**
 * Handle CLI errors
 */

function handleError(err) {
  if (typeof err === 'string' && errors[err]) {
    console.error(errors[err]);
  } else {
    console.error(err);
  }
  process.exit(1);
}
