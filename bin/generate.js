#!/usr/bin/env node

var args = require('minimist')(process.argv.slice(2));
var Resolver = require('resolve-modules');
var defaults = require('../lib/defaults');
var Generate = require('..');

function runner(options) {
  options = options || {};
  var resolver = new Resolver(options);
  var argv = require('base-argv');

  return function(base) {
    this.use(defaults());
    // this.use(plugins.env());
    this.use(argv({plural: 'generators'}));

    this.runner = function(argv) {
      resolver.on('config', function(config) {
        base[options.methodName](config.alias, config, base);
      });
      resolver.resolve();
      return base;
    };

    this.mixin('base', {
      get: function() {
        return this.parent ? this.parent.base : this;
      }
    });
  };
};

var generate = new Generate();

generate.on('config', function(config) {
  console.log('registered:', config.alias);
});

generate.use(runner({
  searchPattern: 'generate-*/generate.js',
  configName: 'generate',
  methodName: 'generator',
  moduleName: 'generate-next'
}));

generate.runner();
console.log(generate)

var argv = generate.argv(args);
generate.cli.process(argv);
