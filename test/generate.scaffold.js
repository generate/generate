'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var through = require('through2');
var Scaffold = require('scaffold');
var Generate = require('..');
var app, scaffold, config;

var fixtures = path.join(__dirname, 'fixtures');
var actual = path.join(__dirname, 'actual');

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
  } catch (err) {}
  return false;
}

function base(cb) {
  return through.obj(function(file, enc, next) {
    var str = file.contents.toString();
    cb(file, str, next);
  });
}

describe.skip('scaffolds', function() {
  beforeEach(function(cb) {
    app = new Generate();
    rimraf(actual, cb);
  });

  afterEach(function(cb) {
    rimraf(actual, cb);
  });

  describe('setup', function() {
    it('should clean out all test fixtures', function(cb) {
      assert(!exists(actual));
      cb();
    });
  });

  describe('targets', function() {
    it('should process files from the process options.cwd', function(cb) {
      scaffold = new Scaffold({
        docs: {
          src: 'b.txt',
          dest: actual,
          cwd: fixtures
        }
      });

      app.scaffold(scaffold, {cwd: fixtures}, function(err) {
        if (err) return cb(err);
        assert(exists('b.txt'));
        cb();
      });
    });

    it('should use the cwd passed on the config.options.cwd', function(cb) {
      assert(!exists('b.txt'));

      scaffold = new Scaffold({
        cwd: fixtures,
        src: 'b.txt',
        dest: actual
      });

      app.scaffold(scaffold)
        .on('error', cb)
        .on('end', function() {
          assert(exists('b.txt'));
          cb();
        });
    });

    it('should work with no options:', function(cb) {
      scaffold = new Scaffold({src: 'b.txt', dest: actual, cwd: fixtures});
      app.scaffold(scaffold)
        .on('error', cb)
        .on('end', function() {
          assert(exists('b.txt'));
          cb();
        });
    });

    it('should process a single file', function(cb) {
      assert(!exists('a.txt'));

      scaffold = new Scaffold({
        cwd: fixtures,
        src: 'a.txt',
        dest: actual
      });

      app.scaffold(scaffold)
        .on('error', cb)
        .on('end', function() {
          assert(exists('a.txt'));
          cb();
        });
    });

    it('should process a glob of files', function(cb) {
      assert(!exists('a.txt'));
      assert(!exists('b.txt'));
      assert(!exists('c.txt'));

      scaffold = new Scaffold({
        cwd: fixtures,
        src: '*.txt',
        dest: actual
      });

      app.scaffold(scaffold)
        .on('error', cb)
        .on('end', function() {
          assert(exists('a.txt'));
          assert(exists('b.txt'));
          assert(exists('c.txt'));
          cb();
        });
    });
  });

  describe('plugin', function() {
    it('should use a plugin to modify file contents', function(cb) {
      app.plugin('append', function(opts) {
        opts = opts || {};
        return base(function(file, str, next) {
          file.contents = new Buffer(str + opts.suffix);
          next(null, file);
        });
      });

      scaffold = new Scaffold({
        cwd: fixtures,
        src: '*.txt',
        dest: actual
      });

      app.scaffold(scaffold, {suffix: 'zzz'})
        .on('error', cb)
        .on('data', function(data) {
          var str = data.contents.toString();
          var end = str.slice(-3);
          assert(end === 'zzz');
        })
        .on('end', function() {
          assert(exists('example.txt'));
          cb();
        });
    });

    it('should run plugins defined on config.options', function(cb) {
      function appendString(suffix) {
        return base(function(file, str, next) {
          file.contents = new Buffer(str + suffix);
          next(null, file);
        });
      }

      app.plugin('a', appendString('aaa'));
      app.plugin('b', appendString('bbb'));
      app.plugin('c', appendString('ccc'));

      scaffold = new Scaffold({
        options: {pipeline: ['a', 'c']},
        cwd: fixtures,
        src: 'a.txt',
        dest: actual
      });

      app.scaffold(scaffold, {suffix: 'zzz'})
        .on('error', cb)
        .on('data', function(data) {
          var str = data.contents.toString();
          assert(str.indexOf('bbb') === -1);
          var end = str.slice(-6);
          assert(end === 'aaaccc');
        })
        .on('end', function() {
          assert(exists('a.txt'));
          cb();
        });
    });

    it('should run plugins defined on process.options', function(cb) {
      function appendString(suffix) {
        return base(function(file, str, next) {
          file.contents = new Buffer(str + suffix);
          next(null, file);
        });
      }

      app.plugin('a', appendString('aaa'));
      app.plugin('b', appendString('bbb'));
      app.plugin('c', appendString('ccc'));

      scaffold = new Scaffold({
        cwd: fixtures,
        src: 'a.txt',
        dest: actual
      });

      app.scaffold(scaffold, {pipeline: ['a', 'c'], suffix: 'zzz'})
        .on('error', cb)
        .on('data', function(data) {
          var str = data.contents.toString();
          assert(str.indexOf('bbb') === -1);
          var end = str.slice(-6);
          assert(end === 'aaaccc');
        })
        .on('end', function() {
          assert(exists('a.txt'));
          cb();
        });
    });
  });
});

