/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Generate = support.resolve();
var generate;

describe('generate', function() {
  describe('constructor', function() {
    it('should create an instance of Generate:', function() {
      generate = new Generate();
      assert(generate instanceof Generate);
    });

    it('should new up without new:', function() {
      generate = Generate();
      assert(generate instanceof Generate);
    });
  });

  describe('prototype methods', function() {
    beforeEach(function() {
      generate = new Generate();
    });

    it('should expose `addLeaf`', function() {
      assert(typeof generate.addLeaf === 'function');
    });

    it('should expose `compose`', function() {
      assert(typeof generate.compose === 'function');
    });

    it('should expose `generator`', function() {
      assert(typeof generate.generator === 'function');
    });

    it('should expose `getGenerator`', function() {
      assert(typeof generate.getGenerator === 'function');
    });

    it('should expose `registerPath`', function() {
      assert(typeof generate.registerPath === 'function');
    });

    it('should expose `register`', function() {
      assert(typeof generate.register === 'function');
    });

    it('should expose `extendGenerator`', function() {
      assert(typeof generate.extendGenerator === 'function');
    });

    it('should expose `process`', function() {
      assert(typeof generate.process === 'function');
    });

    it('should expose `each`', function() {
      assert(typeof generate.each === 'function');
    });

    it('should expose `eachSeries`', function() {
      assert(typeof generate.eachSeries === 'function');
    });

    it('should expose `scaffold`', function() {
      assert(typeof generate.scaffold === 'function');
    });
  });

  describe('prototype properties', function() {
    beforeEach(function() {
      generate = new Generate();
    });

    it('should expose `name`', function() {
      assert(typeof generate.name === 'string');
    });

    it('should expose `base`', function() {
      assert(typeof generate.base === 'object');
    });
  });

  describe('instance', function() {
    beforeEach(function() {
      generate = new Generate();
    });

    it('should default `name` to `generate`', function() {
      generate.name.should.equal('generate');
    });

    it('should default `name` to `assemble`', function() {
      delete generate._name;
      generate.name.should.equal('assemble');
    });

    it('should default `name` to `base`', function() {
      delete generate._name;
      delete generate._appname;
      generate.name.should.equal('base');
    });

    it('should set `name` to `base`', function() {
      generate.name = 'base';
      generate.name.should.equal('base');
    });

    it('should use `options.name` for `name`', function() {
      generate = new Generate({name: 'generate'});
      delete generate._name;
      generate.name.should.equal('generate');
    });

    it('should return `this` as `base`', function() {
      generate.base.should.deepEqual(generate);
    });

    it('should return generator "base" as `base`', function() {
      var base = new Generate();
      generate.register('base', base);
      generate.base.should.deepEqual(base);
    });

    it('should return generate as `base`', function() {
      var child = new Generate();
      generate.register('child', child);
      child.base.should.deepEqual(generate);
    });
  });
});
