require('mocha');
require('should');
var assert = require('assert');
var Generate = require('..');
var Base = Generate.Base;
var app;

describe('app', function () {
  describe('constructor', function () {
    it('should create an instance of Generate:', function () {
      app = new Generate();
      assert(app instanceof Generate);
    });

    it('should new up without new:', function () {
      app = Generate();
      assert(app instanceof Generate);
    });
  });

  describe('static methods', function () {
    it('should expose `extend`:', function () {
      assert(typeof Generate.extend ==='function');
    });
  });

  describe('prototype methods', function () {
    beforeEach(function() {
      app = new Generate();
    });

    it('should expose `set`', function () {
      assert(typeof app.set ==='function');
    });
    it('should expose `get`', function () {
      assert(typeof app.get ==='function');
    });
    it('should expose `visit`', function () {
      assert(typeof app.visit ==='function');
    });
    it('should expose `define`', function () {
      assert(typeof app.define ==='function');
    });
    it('should expose `src`', function () {
      assert(typeof app.src === 'function');
    });
    it('should expose `dest`', function () {
      assert(typeof app.dest === 'function');
    });
    it('should expose `process`', function () {
      assert(typeof app.process === 'function');
    });
    it('should expose `copy`', function () {
      assert(typeof app.copy === 'function');
    });
  });

  describe('instance', function () {
    beforeEach(function() {
      app = new Generate();
    });

    it('should set a value on the instance:', function () {
      app.set('a', 'b');
      assert(app.a ==='b');
    });

    it('should get a value from the instance:', function () {
      app.set('a', 'b');
      assert(app.get('a') ==='b');
    });

    it('should visit a method:', function () {
      app.visit('set', {foo: 'bar'});
      assert(app.get('foo') ==='bar');
    });
  });

  describe('initialization', function () {
    it('should listen for errors:', function (done) {
      app = new Generate();
      app.on('error', function (err) {
        assert(err.message === 'foo');
        done();
      });
      app.emit('error', new Error('foo'));
    });
  });
});
