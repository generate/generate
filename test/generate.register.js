/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Generate = support.resolve();
var Base = Generate.Base;
var generate;

describe('generate.register', function() {
  beforeEach(function() {
    generate = new Generate();
  });

  it('should register a Generate instance', function() {
    var child = new Generate();
    generate.register('child', child);
    generate.generators.should.have.property('child');
    assert(typeof generate.generators.child === 'object');
    generate.generators.child.should.deepEqual(child);
  });

  it('should register a generator function', function() {
    var registered = false;
    var child = generate.register('child', function(app, base, env) {
      registered = true;
      assert(typeof app === 'object');
      assert(app.isGenerate === true);
    });
    assert(registered);
    generate.generators.should.have.property('child');
    assert(typeof generate.generators.child === 'object');
    generate.generators.child.should.deepEqual(child);
  });

  it('should register a non-generate instance', function() {
    var child = new Base();
    generate.register('child', child);
    generate.generators.should.have.property('child');
    assert(typeof generate.generators.child === 'object');
    generate.generators.child.should.deepEqual(child);
  });

  it('should register a generator from a string', function() {
    var one = generate.register('one', './test/fixtures/one/generator.js');
    generate.generators.should.have.property('one');
    assert(typeof generate.generators.one === 'object');
    generate.generators.one.should.deepEqual(one);
  });
});
