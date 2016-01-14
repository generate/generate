'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var Env = require('../lib/env');
var env;

describe('env', function() {
  describe('errors', function() {
    it('should throw an error when config file is not passed', function(cb) {
      try {
        new Env();
        cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'expected configfile to be a string');
        cb();
      }
    });

    it('should throw an error when modulename is not passed', function(cb) {
      try {
        new Env('generator.js');
        cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'expected modulename to be a string');
        cb();
      }
    });

    it('should throw an error when cwd is not passed', function(cb) {
      try {
        new Env('generator.js', 'generate');
        cb(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'expected cwd to be a string');
        cb();
      }
    });
  });

  describe('constructor', function() {
    it('should create an instance of Env:', function() {
      env = new Env('generator.js', 'generate', process.cwd());
      assert(env instanceof Env);
    });
  });

  describe('main objects', function() {
    beforeEach(function() {
      env = new Env('generator.js', 'generate', process.cwd());
    });

    it('should expose `config`', function() {
      assert(typeof env.config === 'object');
    });

    it('should expose `user`', function() {
      assert(typeof env.user === 'object');
    });

    it('should expose `module`', function() {
      assert(typeof env.module === 'object');
    });
  });

  describe('properties', function() {
    beforeEach(function() {
      env = new Env('generator.js', 'generate', process.cwd());
    });

    describe('.createEnv', function() {
      it('should expose `createEnv`', function() {
        assert(typeof env.createEnv === 'function');
      });

      it('should create a new Env with the give configfile and cwd', function() {
        env = env.createEnv('generator.js', path.resolve(__dirname, '..'));
        assert(env.config.cwd === path.resolve(__dirname, '..'));
      });
    });

    describe('.createEnv', function() {
      it('should create a new Env with the give configfile and cwd', function() {
        env = env.createEnv('generator.js', path.resolve(__dirname, '..'));
        assert(env.config.cwd === path.resolve(__dirname, '..'));
      });
    });
  });

  describe('methods', function() {
    beforeEach(function() {
      env = new Env('generator.js', 'generate', process.cwd());
    });

    describe('.resolve', function() {
      it('should expose `resolve`', function() {
        assert(typeof env.resolve === 'function');
      });

      it('should resolve paths to generators using glob patterns', function() {
        env.resolve('generator.js', {cwd: path.resolve(__dirname, '..')});
        assert(Object.keys(env.configs).length === 1);
      });
    });
  });

  describe('Config', function() {
    beforeEach(function() {
      env = new Env('generator.js', 'generate', process.cwd());
    });

    it('should resolve the "cwd" to generators', function() {
      env.resolve('generator.js', {cwd: path.resolve(__dirname, '..')});
      assert.equal(env.config.cwd, path.resolve(__dirname, '..'));
    });

    it('should resolve the "path" to generators', function() {
      env.resolve('generator.js', {cwd: path.resolve(__dirname, '..')});
      assert.equal(env.config.path, path.resolve(__dirname, '../generator.js'));
    });

    it('should resolve the "pkgPath" to generators', function() {
      env.resolve('generator.js', {cwd: path.resolve(__dirname, '..')});
      assert.equal(env.config.pkgPath, path.resolve(__dirname, '../package.json'));
    });

    it('should resolve the "pkg" for generators', function() {
      env.resolve('generator.js', {cwd: path.resolve(__dirname, '..')});
      assert.equal(env.config.pkg.name, 'generate');
    });

    it('should be null when "pkgPath" does not exist', function() {
      env.resolve('generator.js', {cwd: 'foo'});
      assert.equal(env.config.pkgPath, null);
    });

    it('should be null when "pkg" does not exist', function() {
      env.resolve('generator.js', {cwd: 'foo'});
      assert.equal(env.config.pkg, null);
    });
  });
});
