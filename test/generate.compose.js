'use strict';

require('mocha');
require('should');
var support = require('./support');
var Generate = support.resolve();
var generate;

describe('generate.compose', function() {
  beforeEach(function() {
    generate = new Generate();
  });

  it('should compose a generator', function() {
    var foo = generate.generator('foo', function(app) {
      app.task('foo', function(cb) {
        cb();
      });
    });

    var bar = generate.generator('bar', function(app) {
      app.task('bar', function(cb) {
        cb();
      });
    });

    foo.tasks.should.have.property('foo');
    bar.tasks.should.have.property('bar');

    bar.tasks.should.not.have.property('foo');
    foo.tasks.should.not.have.property('bar');

    foo.compose(bar, 'foo');
    bar.tasks.should.have.property('foo');
    bar.compose(foo, 'bar');
    foo.tasks.should.have.property('bar');
  });

  it('should compose a generator by name', function() {
    var foo = generate.generator('foo', function(app) {
      app.task('foo', function(cb) {
        cb();
      });
    });

    var bar = generate.generator('bar', function(app) {
      app.task('bar', function(cb) {
        cb();
      });
    });

    foo.tasks.should.have.property('foo');
    bar.tasks.should.have.property('bar');

    bar.tasks.should.not.have.property('foo');
    foo.tasks.should.not.have.property('bar');

    generate.compose(bar, 'foo');
    bar.tasks.should.have.property('foo');
    generate.compose(foo, 'bar');
    foo.tasks.should.have.property('bar');
  });
});
