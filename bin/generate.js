#!/usr/bin/env node

process.env.GENERATE_CLI = true;

require('set-blocking')(true);

var generator =  require('../lib/generator');
var commands = require('../lib/commands');
var plugins =  require('../lib/plugins');
var utils = require('../lib/utils');
var argv = require('yargs-parser')(process.argv.slice(2));
var Generate = require('..');

/**
 * Listen for errors on all instances
 */

Generate.on('generate.preInit', function(app) {
  app.on('error', function(err) {
    console.log(err.stack);
    process.exit(1);
  });
});

/**
 * Initialize generate CLI
 */

var config = {name: 'generate', configName: 'generator'};

plugins.runner(Generate, config, argv, function(err, app, ctx) {
  if (err) handleErr(app, err);

  app.set('cache.runnerContext', ctx);
  app.register('defaults', require('../lib/generator'));
  commands(app, ctx);

  app.cli.process(ctx.argv, function(err) {
    if (err) app.emit('error', err);
    app.emit('done');
    process.exit();
  });
});

/**
 * Custom lookup function for resolving generators
 */

function handleErr(app, err) {
  if (app && app.base.hasListeners('error')) {
    app.base.emit('error', err);
  } else {
    console.log(err.stack);
    process.exit(1);
  }
}
