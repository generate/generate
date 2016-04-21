'use strict';

require('mocha');
var assert = require('assert');
var Generate = require('..');
var generate;

describe('.toAlias', function() {
  beforeEach(function() {
    generate = new Generate();
  });

  it('should not create an alias when no prefix is given', function() {
    assert.equal(generate.toAlias('foo-bar'), 'foo-bar');
  });

  it('should create an alias using the given alias function', function() {
    var alias = generate.toAlias('one-two-three', {
      toAlias: function(name) {
        return name.slice(name.lastIndexOf('-') + 1);
      }
    });
    assert.equal(alias, 'three');
  });
});
