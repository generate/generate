#!/usr/bin/env node

process.env.GENERATE_CLI = true;

var generator =  require('../lib/generator');
var commands = require('../lib/commands');
var plugins =  require('../lib/plugins');
var utils = require('../lib/utils');
var argv = utils.yargs(process.argv.slice(2));
var Generate = require('..');

/**
 * Initialize generate CLI
 */

var config = {name: 'generate', configName: 'generator'};

plugins.runner(Generate, config, argv, function(err, app, ctx) {
  if (err) {
    console.log(err.stack);
    process.exit(1);
  }

  app.on('error', function(err) {
    console.log(err);
    console.log(err.stack);
    process.exit(1);
  });

  commands(app, ctx);
  app.register('defaults', require('../lib/generator'));
  app.option('lookup', lookup(app));

  app.cli.process(ctx.argv, function(err) {
    if (err) app.emit('error', err);
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
      patterns.unshift(key);
    }
    return patterns;
  }
}
