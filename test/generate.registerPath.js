'use strict';

/* deps: coveralls istanbul */
require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var Generate = support.resolve();
var generate;

describe('generate.registerPath', function() {
  beforeEach(function() {
    generate = new Generate();
  });

  it('should register a generator function from a file path', function() {
    var one = generate.registerPath('one', './test/fixtures/one/generator.js');
    generate.generators.should.have.property('one');
    assert(typeof generate.generators.one === 'object');
    generate.generators.one.should.deepEqual(one);
  });

  it('should register a Generate instance from a file path', function() {
    var two = generate.registerPath('two', './test/fixtures/two/generate.js');
    generate.generators.should.have.property('two');
    assert(typeof generate.generators.two === 'object');
    generate.generators.two.should.deepEqual(two);
  });
});
