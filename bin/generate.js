#!/usr/bin/env node

var args = require('minimist')(process.argv.slice(2), {
  alias: {verbose: 'v'}
});
var Resolver = require('resolve-modules');
var utils = require('../lib/utils');
var defaults = require('../lib/defaults');
var Generate = require('..');

function runner(options) {
  options = options || {};
  var resolver = new Resolver(options);
  var argv = require('base-argv');

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

var generate = new Generate();

generate.on('error', function(err) {
  console.log('error:', err.stack);
});

generate.on('config', function(config) {
  if (args.v) console.log('registered:', config.alias);
});

generate.use(runner({
  searchPattern: 'generate-*/generate.js',
  configName: 'generate',
  methodName: 'generator',
  moduleName: 'generate-next'
}));

generate.runner();

var argv = generate.argv(args);
generate.cli.process(argv);

generate.task('run', function(cb) {
  generate.generate(argv.generators, function(err) {
    if (err) return cb(err);
    cb();
  });
});

generate.build(['files', 'templates', 'run', 'dest'], function(err) {
  if (err) return console.log(err);
  utils.timestamp('done');
});
