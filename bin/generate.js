#!/usr/bin/env node

var Generate = require('..');
var utils = require('../lib/utils');
var defaults = require('../lib/defaults');
var Resolver = require('resolve-modules');
var argv = require('base-argv');
var args = require('minimist')(process.argv.slice(2), {
  alias: {verbose: 'v'}
});

function runner(options) {
  options = options || {};
  var resolver = new Resolver(options);

  return function(base) {
    // this.use(plugins.env());
    this.use(defaults());
    this.use(argv({plural: 'generators'}));

    this.runner = function() {
      resolver.on('config', function(config) {
        base[options.methodName](config.alias, config, base);
        base.emit('config', config);
      });
      resolver.resolve();
      return base;
    };
  };
};

/**
 * Initialize Generate
 */

var generate = new Generate();

/**
 * Listen for errors
 */

generate.on('error', function(err) {
  console.log('error:', err.stack);
});

generate.on('config', function(config) {
  if (args.v) console.log('registered:', config.alias);
});

/**
 * Initialize the "runner" plugin, and find generators that
 * match `searchPattern`
 */

generate.use(runner({
  searchPattern: 'generate-*/generate.js',
  configName: 'generate',
  methodName: 'generator',
  moduleName: 'generate-next'
}));

generate.runner();

/**
 * Process command line arguments
 */

var argv = generate.argv(args);
generate.cli.process(argv);

/**
 * Run any generators specified by `argv`
 */

generate.task('run', function(cb) {
  generate.runGenerators(argv.generators, cb);
});

/**
 * Default tasks to run
 */

generate.build(['files', 'run', 'dest'], function(err) {
  if (err) return console.log(err);
  utils.timestamp('done');
});
