'use strict';

require('mocha');
var assert = require('assert');
var path = require('path');
var App = require('..');
var app;

describe('app.cwd', function () {
  it('should be a getter', function () {
    app = new App();
    assert.equal(app.cwd, process.cwd());
  });

  it('should be a setter', function () {
    app = new App();
    app.cwd = 'foo';
    assert.equal(app.cwd, path.resolve(process.cwd(), 'foo'));
  });

  it('should update cwd from the options', function () {
    app = new App();
    app.option('cwd', 'templates');
    assert.equal(app.cwd, path.resolve(process.cwd(), 'templates'));
    app.option('cwd', 'subgenerator');
    assert.equal(app.cwd, path.resolve(process.cwd(), 'subgenerator'));
  });
});
