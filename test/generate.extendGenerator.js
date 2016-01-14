'use strict';

require('mocha');
var assert = require('assert');
var support = require('./support');
var Generate = support.resolve();
var generate;

describe('generate.extendGenerator', function() {
  beforeEach(function() {
    generate = new Generate();
  });

  it('should throw an error when trying to extend an instance', function(done) {
    var foo = new Generate({name: 'foo'});
    delete foo.fn;
    
    try {
      generate.extendGenerator(foo);
      done(new Error('Expected an error.'));
    } catch (err) {
      assert.equal(err.message, 'generators must export a function to extend other generators');
      done();
    }
  });

  it('should extend a generator', function() {
    var foo = generate.generator('foo', function(app) {
      app.task('foo', function(cb) { cb(); });
    });

    var bar = generate.generator('bar', function(app) {
      app.task('bar', function(cb) { cb(); });
    });

    assert(foo.tasks.hasOwnProperty('foo'));
    assert(bar.tasks.hasOwnProperty('bar'));

    assert(!bar.tasks.hasOwnProperty('foo'));
    assert(!foo.tasks.hasOwnProperty('bar'));

    foo.extendGenerator(bar);
    assert(bar.tasks.hasOwnProperty('foo'));
    bar.extendGenerator(foo);
    assert(foo.tasks.hasOwnProperty('bar'));
  });
});
