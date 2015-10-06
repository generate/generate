require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var Files = require('expand-files');
var Generate = require('..');
var app, files, config;

var fixtures = path.join(__dirname, 'fixtures/*.txt');
var outpath = path.join(__dirname, 'actual');

function expand(options) {
  var config = new Files();
  config.expand(options);
  return config.files[0];
}

function fixture(name) {
  return path.join(__dirname, 'fixtures', name);
}

function exists(name) {
  var fp = path.join(__dirname, 'actual', name);
  return fs.existsSync(fp);
}

describe('process()', function() {
  beforeEach(function (done) {
    rimraf(outpath, done);
    app = new Generate();
  });

  afterEach(function (done) {
    rimraf(outpath, done);
  });

  describe('streams', function () {
    it('should use the cwd passed on the app options', function (done) {
      app = new Generate({cwd: 'test/fixtures'});

      var dest = path.join(__dirname, 'actual');
      app.process('c.txt', dest)
        .on('data', function (file) {
          assert.equal(typeof file, 'object');
          assert.equal(file.contents.toString(), 'CCC');
        })
        .on('end', function () {
          assert(exists('c.txt'));
          done();
        });
    });

    it('should use the cwd passed on the process options', function (done) {
      var dest = path.join(__dirname, 'actual');
      var opts = {cwd: 'test/fixtures'};
      var config = {src: 'b.txt', dest: dest};

      app.process(config, opts, function (err) {
        if (err) return done(err);
        assert(exists('b.txt'));
        done();
      });
    });

    it('should work with no options:', function (done) {
      var dest = path.join(__dirname, 'actual');
      config = expand({src: 'b.txt', dest: dest, cwd: 'test/fixtures'});

      app.process(config, function (err) {
        if (err) return done(err);
        assert(exists('b.txt'));
        done();
      });
    });

    it('should use the cwd passed on the config', function (done) {
      var dest = path.join(__dirname, 'actual');
      config = expand({src: 'b.txt', dest: dest, cwd: 'test/fixtures'});

      assert(!exists('b.txt'));

      app.process(config, function (err) {
        if (err) return done(err);
        assert(!err);
        assert(exists('b.txt'));
        done();
      });
    });

    it('should process a single file', function (done) {
      app.process(fixture('a.txt'), path.join(__dirname, 'actual'))
        .on('data', function (file) {
          assert.equal(typeof file, 'object');
          assert.equal(file.contents.toString(), 'AAA');
        })
        .on('end', function () {
          assert(exists('a.txt'));
          done();
        });
    });

    it('should process a glob of files', function (done) {
      app.process(fixtures, path.join(__dirname, 'actual'))
        .on('data', function (file) {
          assert.equal(typeof file, 'object');
        })
        .on('end', function () {
          assert(exists('a.txt'));
          assert(exists('b.txt'));
          assert(exists('c.txt'));
          done();
        });
    });
  });
});
