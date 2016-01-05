/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Generate = support.resolve();
var Base = Generate.Base;
var generate;

describe('generate.compose', function() {
  beforeEach(function() {
    generate = new Generate();
  });

  it('should throw an error when trying to compose an instance', function(done) {
    var foo = new Generate({name: 'foo'});
    try {
      generate.compose(foo);
      done(new Error('Expected an error.'));
    } catch (err) {
      err.message.should.equal('generators must export a function to extend other generators');
      done();
    }
  });

  it('should compose a generator', function() {
    var foo = generate.generator('foo', function(app) {
      app.task('foo', function(cb) { cb(); });
    });

    var bar = generate.generator('bar', function(app) {
      app.task('bar', function(cb) { cb(); });
    });

    foo.tasks.should.have.property('foo');
    bar.tasks.should.have.property('bar');

    bar.tasks.should.not.have.property('foo');
    foo.tasks.should.not.have.property('bar');

    foo.compose(bar);
    bar.tasks.should.have.property('foo');
    bar.compose(foo);
    foo.tasks.should.have.property('bar');
  });

  it('should compose a generator by name', function() {
    var foo = generate.generator('foo', function(app) {
      app.task('foo', function(cb) { cb(); });
    });

    var bar = generate.generator('bar', function(app) {
      app.task('bar', function(cb) { cb(); });
    });

    foo.tasks.should.have.property('foo');
    bar.tasks.should.have.property('bar');

    bar.tasks.should.not.have.property('foo');
    foo.tasks.should.not.have.property('bar');

    generate.compose('foo', bar);
    bar.tasks.should.have.property('foo');
    generate.compose('bar', foo);
    foo.tasks.should.have.property('bar');
  });
});
