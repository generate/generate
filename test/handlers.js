'use strict';

var path = require('path');
var assert = require('assert');
var should = require('should');
var rimraf = require('rimraf');
var File = require('vinyl');
var App = require('..');
var app

describe('handlers', function() {
  beforeEach(function() {
    app = new App();
  });

  afterEach(function(cb) {
    rimraf(path.join(__dirname, './out-fixtures/'), cb);
  });

  it('should handle onLoad', function(cb) {
    var count = 0;
    app.onLoad(/./, function(file, next) {
      count++;
      next();
    });

    app.src(path.join(__dirname, './fixtures/vinyl/test.coffee'))
      .pipe(app.dest('./out-fixtures/', {cwd: __dirname}))
      .on('end', function() {
        assert.equal(count, 1);
        cb();
      });
  });

  it('should handle preWrite', function(cb) {
    var count = 0;
    app.preWrite(/./, function(file, next) {
      count++;
      next();
    });

    var srcPath = path.join(__dirname, './fixtures/vinyl/test.coffee');
    var stream = app.dest('./out-fixtures/', {
      cwd: __dirname
    });

    stream.once('finish', function() {
      assert.equal(count, 1);
      cb();
    });

    var file = new File({
      path: srcPath,
      cwd: __dirname,
      contents: new Buffer("1234567890")
    });
    file.options = {};

    stream.write(file);
    stream.end();
  });

  it('should handle postWrite', function(cb) {
    var count = 0;
    app.postWrite(/./, function(file, next) {
      count++;
      next();
    });

    var srcPath = path.join(__dirname, './fixtures/vinyl/test.coffee');
    var stream = app.dest('./out-fixtures/', {
      cwd: __dirname
    });

    stream.once('finish', function() {
      assert.equal(count, 1);
      cb();
    });

    var file = new File({
      path: srcPath,
      cwd: __dirname,
      contents: new Buffer("1234567890")
    });
    file.options = {};

    stream.write(file);
    stream.end();
  });
});
