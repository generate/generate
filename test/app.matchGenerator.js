'use strict';

require('mocha');
var assert = require('assert');
var option = require('base-option');
var Base = require('..');
var base;

describe('.matchGenerator', function() {
  beforeEach(function() {
    base = new Base();
    base.use(option());

    base.option('toAlias', function(key) {
      return key.replace(/^generate-(.*)/, '$1');
    });
  });

  it('should match a generator by name', function() {
    base.register('generate-foo');

    var gen = base.matchGenerator('generate-foo');
    assert(gen);
    assert.equal(gen.env.name, 'generate-foo');
    assert.equal(gen.env.alias, 'foo');
  });

  it('should match a generator by alias', function() {
    base.register('generate-foo');

    var gen = base.matchGenerator('foo');
    assert(gen);
    assert.equal(gen.env.name, 'generate-foo');
    assert.equal(gen.env.alias, 'foo');
  });

  it('should match a generator by path', function() {
    base.register('generate-foo');

    var gen = base.matchGenerator(require.resolve('generate-foo'));
    assert(gen);
    assert.equal(gen.env.name, 'generate-foo');
    assert.equal(gen.env.alias, 'foo');
  });
});
