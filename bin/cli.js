#!/usr/bin/env node

var path = require('path');
var utils = require('../lib/utils');
var errors = require('./errors');
var generate = require('..');
var Env = generate.Env;

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
    cwd = process.cwd();
  }

  /**
   * Create the base "generate" instance
   */

  var baseDir = path.resolve(__dirname, '..');
  var baseEnv = createEnv('generator.js', baseDir);

  // instantiate
  var app = null;
  var base = generate({cli: true});
  base.option(argv);
  base.env = baseEnv;

  var basePath = path.resolve(__dirname, '../generator.js');

  // set the generater function on the instance
  base.fn = require(basePath);

  /**
   * Get the generator.js to use
   */

  var generator = path.resolve(process.cwd(), 'generator.js');
  if (!utils.exists(generator)) {
    if (utils.isEmpty(process.cwd()) && argv._.length === 0) {
      argv._.unshift('defaults:init');
    }

    generator = basePath;
    cwd = path.dirname(generator);
    app = base;
    base.fn.call(base, base, base, base.env);
  } else {


    /**
     * Create the user's "generate" instance
     */

    var fn = require(generator);
    var env = createEnv('generator.js', process.cwd());
    base.fn.call(base, base, base, base.env);

    function register(app, env, fn) {
      app.option(argv);
      app.set('args', argv);
      app.env = env;
      if (fn) app.fn = fn;

      var name = app.get('env.user.pkg.name');
      if (name) {
        base.register(name, app, env);
      }
    }

    if (typeof fn === 'function') {
      app = generate({cli: true});
      register(app, env, fn);

    } else {
      app = fn;
      register(app, env);
    }
  }

  /**
   * Process command line arguments
   */

  var args = utils.processArgv(base, argv);
  base.set('argv', args);

  /**
   * Support `--emit` for debugging
   *
   * Example:
   *   $ --emit data
   */

  if (argv.emit && typeof argv.emit === 'string') {
    base.on(argv.emit, console.error.bind(console));
  }

  /**
   * Listen for generator configs, and register them
   * as they're emitted
   */

  base.env.on('config', function(name, env) {
    base.register(name, env.config.fn, env);
  });

  /**
   * Resolve generate generators
   */

  base.env
    .resolve('generater-*/generator.js', {
      configfile: 'generator.js',
      cwd: utils.gm
    })
    .resolve('generate-*/generator.js', {
      configfile: 'generator.js',
      cwd: utils.gm
    });

  cb(null, app, base);
}

/**
 * Run
 */

run(function(err, app, base) {
  if (err) handleError(err);

  if (!base) {
    process.exit(0);
  }

  /**
   * Listen for errors
   */

  base.on('error', function(err) {
    console.log(err);
  });

  /**
   * Run tasks
   */

  base.build(app, argv, function(err) {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }
    utils.timestamp('finished ' + utils.check);
    process.exit(0);
  });
});

/**
 * Creat a new `env` object
 */

function createEnv(configfile, cwd) {
  var env = new Env(configfile, 'generate', cwd);;
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
