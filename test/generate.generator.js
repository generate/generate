/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Generate = support.resolve();
var Base = Generate.Base;
var generate;
var one;
var two;

describe('generate.generator', function() {
  before(function() {
    generate = new Generate();
  });

  it('should register a generator function from a file path', function() {
    one = generate.generator('one', './test/fixtures/one/generator.js');
    generate.generators.should.have.property('one');
    assert(typeof generate.generators.one === 'object');
    generate.generators.one.should.deepEqual(one);
  });

  it('should register a Generate instance from a file path', function() {
    two = generate.generator('two', './test/fixtures/two/generate.js');
    generate.generators.should.have.property('two');
    assert(typeof generate.generators.two === 'object');
    generate.generators.two.should.deepEqual(two);
  });

  it('should get a registered generator by name', function() {
    generate.generator('one').should.deepEqual(one);
    generate.generator('two').should.deepEqual(two);
  });
});
