'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var Generate = require('..');
var generate;

var fixtures = path.resolve.bind(path, __dirname + '/fixtures');

describe('env', function() {
  describe('createEnv', function() {
    beforeEach(function() {
      generate = new Generate();
    });

    it('should add an env object to the instance', function() {
      var fn = function() {};
      generate.createEnv('foo', fn);
      assert(generate.env);
    });

    it('should take options as the second arg', function() {
      var fn = function() {};
      generate.createEnv('foo', {}, fn);
      assert(generate.env);
    });

    it('should prime `env` if it doesn\'t exist', function() {
      var fn = function() {};
      delete generate.env;
      generate.createEnv('foo', {}, fn);
      assert(generate.env);
    });

    it('should add an alias to the env object', function() {
      var fn = function() {};
      generate.createEnv('foo', {}, fn);
      assert.equal(generate.env.alias, 'foo');
    });

    it('should use generate as `prefix` when not defined', function() {
      var fn = function() {};
      delete generate.prefix;
      generate.createEnv('foo', {}, fn);
      assert.equal(generate.env.name, 'generate-foo');
    });

    it('should use `prefix` to add a full name to the env object', function() {
      var fn = function() {};
      generate.prefix = 'whatever';
      generate.createEnv('foo', {}, fn);
      assert.equal(generate.env.name, 'whatever-foo');
    });

    it('should try to resolve a path passed as the second arg', function() {
      generate.createEnv('foo', fixtures('generator.js'));
      assert.equal(generate.env.alias, 'foo');
      assert.equal(generate.env.name, 'generate-foo');
    });

    it('should throw an error when the path is not resolved', function(cb) {
      try {
        generate.createEnv('foo', fixtures('whatever.js'));
        cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'cannot find generator: ' + fixtures('whatever.js'));
        cb();
      }
    });
  });
});
