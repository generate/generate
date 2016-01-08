'use strict';

require('mocha');
require('should');
var assert = require('assert');
var toTasks = require('../lib/to-tasks');

describe('to-tasks', function() {
  it('should create a task', function() {
    console.log(toTasks({_: ['foo', 'bar']}, {}, {}))
  });
});

