'use strict';

var capture = require('capture-stream');
var assert = require('assert');

var Logger = require('../lib/logger');

describe('logger', function() {
  it('should create a Logger instance', function() {
    var logger = new Logger();
    assert(logger instanceof Logger);
  });

  it('should create a Logger instance with provided options', function() {
    var logger = new Logger({foo: 'bar'});
    assert.deepEqual(logger.options, {foo: 'bar'});
  });

  it('should write a message out to the standard output', function() {
    var restore = capture(process.stdout);
    var logger = new Logger();
    logger.write('this is a test');
    var output = restore(true);
    assert.equal(output, 'this is a test');
  });

  describe('events', function() {
    it('should emit `log` when `.log` is called', function() {
      var output = [];
      var logger = new Logger();
      logger.on('log', function(msg) {
        output.push(msg);
      });
      logger.log('this is a log message');
      assert.deepEqual(output, ['this is a log message']);
    });

    it('should emit `info` when `.info` is called', function() {
      var output = [];
      var logger = new Logger();
      logger.on('info', function(msg) {
        output.push(msg);
      });
      logger.info('this is an info message');
      assert.deepEqual(output, ['this is an info message']);
    });

    it('should emit `error` when `.error` is called', function() {
      var output = [];
      var logger = new Logger();
      logger.on('error', function(msg) {
        output.push(msg);
      });
      logger.error('this is an error message');
      assert.deepEqual(output, ['this is an error message']);
    });

    it('should emit `warn` when `.warn` is called', function() {
      var output = [];
      var logger = new Logger();
      logger.on('warn', function(msg) {
        output.push(msg);
      });
      logger.warn('this is a warning message');
      assert.deepEqual(output, ['this is a warning message']);
    });

    it('should chain methods together when emitting methods are called', function() {
      var output = [];
      var logger = new Logger();
      function handler(event) {
        return function(msg) {
          output.push(event + ': ' + msg);
        };
      }
      logger.on('log', handler('log'));
      logger.on('info', handler('info'));
      logger.on('error', handler('error'));
      logger.on('warn', handler('warn'));

      logger
        .log('this is a log message')
        .info('this is an info message')
        .error('this is an error message')
        .warn('this is a warning message');

      var expected = [
        'log: this is a log message',
        'info: this is an info message',
        'error: this is an error message',
        'warn: this is a warning message'
      ];

      assert.deepEqual(output, expected);
    });
  });
});
