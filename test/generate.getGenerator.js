'use strict';

var assert = require('assert');
var Generate = require('..');
var generate;

describe('.getGenerator', function() {
  beforeEach(function() {
    generate = new Generate();
  });

  it('should get a generator from the base instance', function() {
    generate.register('abc', function() {});
    var generator = generate.getGenerator('abc');
    assert(generator);
    assert(typeof generator === 'object');
    assert(generator.name === 'abc');
  });

  it('should get nested generator', function() {
    generate.register('abc', function(abc) {
      abc.register('def', function() {});
    });

    var generator = generate.getGenerator('abc.def');
    assert(generator);
    assert(typeof generator === 'object');
    assert(generator.name === 'def');
  });

  it('should get a deeply nested generator', function() {
    generate.register('abc', function(abc) {
      abc.register('def', function(def) {
        def.register('ghi', function(ghi) {
          ghi.register('jkl', function(jkl) {
            jkl.register('mno', function() {});
          });
        });
      });
    });

    var generator = generate.getGenerator('abc.def.ghi.jkl.mno');
    assert(generator);
    assert(typeof generator === 'object');
    assert(generator.name === 'mno');
  });
});
