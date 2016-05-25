'use strict';

require('mocha');
var assert = require('assert');
var App = require('..');
var app;

describe('.tasks plugin', function() {
  it('should register as a plugin', function() {
    var app = new App();
    assert(app.registered.hasOwnProperty('base-generators-tasks'));
  });
});

describe('tasks', function() {
  beforeEach(function() {
    app = new App();
  });

  describe('hasTask', function() {
    it('should return true if a task exists', function() {
      app.task('foo', function() {});
      assert(app.hasTask('foo'));
    });

    it('should return false if a task does not exist', function() {
      app.task('foo', function() {});
      assert(!app.hasTask('bar'));
    });
  });
});
