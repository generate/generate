'use strict';

require('should');
var assert = require('assert');
var pkg = require('../lib/pkg');
var App = require('..');
var app;

describe('pkg plugin', function() {
  beforeEach(function() {
    app = new App();
    app.use(pkg());
  });

  it('should add a "pkg" property to app', function() {
    assert.equal(typeof app.pkg, 'object');
  });

  it('should add a "pkg.data" property', function() {
    assert.equal(typeof app.pkg.data, 'object');
  });

  it('should add a "pkg.get" method', function() {
    assert.equal(typeof app.pkg.get, 'function');
  });

  it('should add a "pkg.set" method', function() {
    assert.equal(typeof app.pkg.set, 'function');
  });

  describe('pkg.name', function() {
    it('should have pkg.name property', function() {
      assert.equal(typeof app.pkg.name, 'string');
    });

    it('should be a setter', function() {
      app.pkg.name = 'foo-bar';
      assert.equal(app.pkg.name, 'foo-bar');
    });

    it('should update nickname', function() {
      app.pkg.name = 'foo-bar';
      assert.equal(app.pkg.nickname, 'fooBar');
      app.pkg.name = 'one-two';
      assert.equal(app.pkg.nickname, 'oneTwo');
    });
  });
});
