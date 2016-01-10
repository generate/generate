'use strict';

var assert = require('assert');
var Generate = require('..');
var app;

describe('generators', function() {
  beforeEach(function() {
    app = new Generate();
  });

  it('should add a generator to app.generators', function() {
    app.register('abc', function() {});
    assert(app.generators.abc);
    assert(typeof app.generators.abc === 'object');
  });

  it('should be an instance of generate', function() {
    app.register('foo', function() {});
    assert(app.generators.foo instanceof Generate);
  });
});
