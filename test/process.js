require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var Files = require('expand-files');
var Generate = require('..');
var app, files, config;

var fixtures = path.join(__dirname, 'fixtures');
var actual = path.join(__dirname, 'actual');

function expand(options) {
  var config = new Files();
  config.expand(options);
  return config.files[0];
}

function output(name) {
  return path.join(actual, name);
}

function fixture(name) {
  return path.join(fixtures, name);
}

function exists(name) {
  try {
    fs.statSync(output(name));
    return true;
  } catch(err) {}
  return false;
}

describe('process()', function() {
  beforeEach(function (done) {
    rimraf(actual, done);
    app = new Generate();
  });

  afterEach(function (done) {
    rimraf(actual, done);
  });

  describe('setup', function () {
    it('should clean out all test fixtures', function (done) {
      assert(!exists(actual));
      done();
    });
  });

  describe('streams', function () {
    it('should process files from the process options.cwd', function (done) {
      config = expand({src: 'b.txt', dest: actual, cwd: fixtures});

      app.process(config, {cwd: fixtures}, function (err) {
        if (err) return done(err);
        assert(exists('b.txt'));
        done();
      });
    });

    it('should use the cwd passed on the config.options.cwd', function (done) {
      assert(!exists('b.txt'));

      config = expand({
        cwd: fixtures,
        src: 'b.txt',
        dest: actual
      });

      app.process(config, function (err) {
        if (err) return done(err);
        assert(!err);
        assert(exists('b.txt'));
        done();
      });
    });

    it('should work with no options:', function (done) {
      config = expand({src: 'b.txt', dest: actual, cwd: fixtures});

      app.process(config, function (err) {
        if (err) return done(err);
        assert(exists('b.txt'));
        done();
      });
    });

    it('should process a single file', function (done) {
      assert(!exists('a.txt'));

      config = expand({
        cwd: fixtures,
        src: 'a.txt',
        dest: actual
      });

      app.process(config, function (err) {
        if (err) return done(err);
        assert(!err);
        assert(exists('a.txt'));
        done();
      });
    });

    it('should process a glob of files', function (done) {
      assert(!exists('a.txt'));
      assert(!exists('b.txt'));
      assert(!exists('c.txt'));

      config = expand({
        cwd: fixtures,
        src: '*.txt',
        dest: actual
      });

      app.process(config, function (err) {
        if (err) return done(err);
        assert(!err);
        assert(exists('a.txt'));
        assert(exists('b.txt'));
        assert(exists('c.txt'));
        done();
      });
    });
  });
});
