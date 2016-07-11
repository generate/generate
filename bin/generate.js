#!/usr/bin/env node

process.env.GENERATE_CLI = true;
process.on('exit', function() {
  require('set-blocking')(true);
});

var util = require('util');
var App = require('..');
var commands = require('../lib/commands');
var plugins = require('../lib/plugins');
var tasks = require('../lib/tasks');
var utils = require('../lib/utils');
var pkg = require('../package');
var args = process.argv.slice(2);
var argv = utils.parseArgs(args);

/**
 * Listen for errors on all instances
 */

App.on('generate.preInit', function(app) {
  app.set('cache.argv', argv);
});

/**
 * Initialize CLI
 */

App.on('generate.postInit', function(app) {
  app.option(argv);
  if (app.macros.has(args)) {
    app.macros.set(args);
    var macro = {};
    macro[args[0]] = args.slice(2).join(' ');
    console.log('saved macro:', util.inspect(macro));
    process.exit();
  }

  var idx = utils.firstIndex(args, ['-D', '--default']);
  if (idx !== -1) {
    args.splice(idx, 1);

    if (args.indexOf('--del') !== -1) {
      var tasks = app.store.get('defaultTasks');
      app.store.del('defaultTasks');
      app.log.warn('deleted default tasks:', tasks);
      app.emit('done');
      process.exit();
    } else {
      app.store.set('defaultTasks', args);
      app.log.success('saved default tasks:', args);
    }
  }

  taskLoggers(app.base);
});

/**
 * Setup listeners
 */

function taskLoggers(base) {
  function logger() {
    if (argv.silent || base.options.silent) return;
    console.log.apply(console, arguments);
  }

  base.on('build', function(event, build) {
    if (build && event === 'starting' || event === 'finished') {
      if (build.isSilent) return;
      var prefix = event === 'finished' ? utils.log.success + ' ' : '';
      var key = build.key.replace(/generate\./, '');
      logger(utils.log.timestamp, event, key, prefix + utils.log.red(build.time));
    }
  });

  base.on('task', function(event, task) {
    console.log(arguments)
    if (task && event === 'starting' || event === 'finished') {
      if (task.isSilent) return;
      var key = task.key.replace(/generate\./, '');
      logger(utils.log.timestamp, event, key, utils.log.red(task.time));
    }
  });
}

/**
 * Initialize Runner
 */

var options = {name: 'generate', configName: 'generator'};

plugins.runner(App, options, argv, function(err, app, runnerContext) {
  if (err) handleErr(app, err);

  app.set('cache.runnerContext', runnerContext);
  commands(app, runnerContext);

  if (!app.generators.defaults) {
    app.register('defaults', require('../lib/generator'));
  }

  var ctx = utils.extend({}, runnerContext);
  var config = app.get('cache.config') || {};
  ctx.argv.tasks = [];

  app.config.process(config, function(err, config) {
    if (err) return handleErr(app, err);

    // reset `cache.config`
    app.base.cache.config = config;

    app.cli.process(ctx.argv, function(err) {
      if (err) return handleErr(app, err);

      var arr = tasks(app, ctx, argv);
      app.log.success('running tasks:', arr);

      if (ctx.env.configPath) {
        app = app.generator('default', require(ctx.env.configPath));
      }

      app.generate(arr, function(err) {
        if (err) return handleErr(app, err);
      });
    });
  });
});

/**
 * Handle errors
 */

function handleErr(app, err) {
  if (app && app.base.hasListeners('error')) {
    app.base.emit('error', err);
  } else {
    console.log(err.stack);
    process.exit(1);
  }
}
