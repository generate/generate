'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var Base = require('..');
var env = require('base-env');
var plugins = require('base-plugins');
var base;

Base.use(plugins());
var fixtures = path.resolve.bind(path, __dirname + '/fixtures');

describe('env', function() {
  describe('plugin', function() {
    it('should work as a plugin', function() {
      base = new Base();
      base.use(env());
      assert.equal(typeof base.createEnv, 'function');
    });

    it('should only register the plugin once', function() {
      base = new Base();
      base.registered = {};

      var count = 0;
      base.on('plugin', function() {
        count++;
      });

      base.use(env());
      base.use(env());
      base.use(env());
      base.use(env());
      base.use(env());
      assert.equal(count, 1);
    });
  });

  describe('createEnv paths', function() {
    beforeEach(function() {
      base = new Base();
    });

    describe('alias and function', function() {
      it('should make the alias the exact name when the second arg is a function', function() {
        var fn = function() {};
        base.createEnv('foo-bar-baz', fn);
        assert(base.env);
        assert(base.env.alias);
        assert.equal(base.env.alias, 'foo-bar-baz');
      });

      it('should not change the name when the second arg is a function', function() {
        var fn = function() {};
        base.createEnv('foo-bar-baz', fn);
        assert(base.env);
        assert(base.env.name);
        assert.equal(base.env.name, 'foo-bar-baz');
      });
    });

    describe('alias and path', function() {
      it('should set the env.name using the given name', function() {
        base.createEnv('foo', 'generate-foo/generator.js');
        assert.equal(base.env.name, 'foo');
      });

      it('should not change the name when the second arg is a function', function() {
        var fn = function() {};
        base.createEnv('foo-bar-baz', fn);
        assert(base.env);
        assert(base.env.name);
        assert.equal(base.env.name, 'foo-bar-baz');
      });
    });
  });

  describe('createEnv', function() {
    beforeEach(function() {
      base = new Base();
    });

    it('should add an env object to the instance', function() {
      var fn = function() {};
      base.createEnv('foo', fn);
      assert(base.env);
    });

    it('should take options as the second arg', function() {
      var fn = function() {};
      base.createEnv('foo', {}, fn);
      assert(base.env);
    });

    it('should prime `env` if it doesn\'t exist', function() {
      var fn = function() {};
      delete base.env;
      base.createEnv('foo', {}, fn);
      assert(base.env);
    });

    it('should add an alias to the env object', function() {
      var fn = function() {};
      base.createEnv('foo', {}, fn);
      assert.equal(base.env.alias, 'foo');
    });

    it('should not prefix the alias when a function is passed', function() {
      var fn = function() {};
      delete base.prefix;
      base.createEnv('foo', {}, fn);
      assert.equal(base.env.name, 'foo');
    });

    it('should not prefix a custom alias when a function is passed', function() {
      var fn = function() {};
      base.prefix = 'whatever';
      base.createEnv('foo', {}, fn);
      assert.equal(base.env.name, 'foo');
    });

    it('should try to resolve a path passed as the second arg', function() {
      base.createEnv('foo', fixtures('generator.js'));
      assert.equal(base.env.alias, 'foo');
      assert.equal(base.env.name, 'foo');
    });

    it('should try to resolve a path passed as the second arg', function() {
      base.createEnv('foo', 'generate-foo/generator.js');
      assert.equal(base.env.alias, 'foo');
      assert.equal(base.env.name, 'foo');
    });

    it('should throw an error when the path is not resolved', function(cb) {
      try {
        base.createEnv('foo', fixtures('whatever.js'));
        base.env.path;
        cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'Cannot find module \'' + fixtures('whatever.js/generator.js') + '\'');
        cb();
      }
    });
  });
});
