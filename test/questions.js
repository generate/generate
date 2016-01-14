'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('content', function() {
  beforeEach(function() {
    app = new App();
    app.questions.del('a');
  });

  it('should store a question:', function() {
    app.question('a', 'b');
    assert(app.questions);
    assert(app.questions.cache);
    assert(app.questions.cache.a);
    assert(app.questions.cache.a.name === 'a');
    assert(app.questions.cache.a.options.message === 'b');
  });

  it('should ask a question and use data value to answer:', function(cb) {
    app.question('a', 'b');
    app.data('a', 'z');

    app.ask('a', function(err, answer) {
      assert(!err);
      assert(answer);
      assert.equal(answer.a, 'z');
      cb();
    });
  });

  it('should ask a question and use store value to answer:', function(cb) {
    app.question('a', 'b');
    app.store.set('a', 'c');

    app.ask('a', function(err, answer) {
      assert(!err);
      assert(answer);
      assert.equal(answer.a, 'c');
      cb();
    });
  });

  it('should ask a question and use config value to answer:', function(cb) {
    app.question('a', 'b');
    app.store.set('a', 'c');

    app.ask('a', function(err, answer) {
      assert(!err);
      assert(answer);
      assert.equal(answer.a, 'c');
      cb();
    });
  });
});
