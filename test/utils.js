var assert = require('assert');
var utils = require('../lib/utils');

describe('utils', function() {
  describe('alias', function() {
    it('should throw an error when pkgName is not a string', function(done) {
      try {
        utils.alias(null, {});
        done(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'expected name to be a string');
        done();
      }
    });

    it('should use the cwd when filepath and pkgName are undefined', function() {
      assert.equal(utils.alias(), 'generate');
    });

    it('should create an alias from a given pkgName', function() {
      assert.equal(utils.alias(null, 'generator-foo'), 'foo');
    });

    it.skip('should create an alias from a given file filepath', function() {
      assert.equal(utils.alias(__filename), 'test');
    });

    it.skip('should create an alias from a given directory filepath', function() {
      assert.equal(utils.alias(__dirname), 'test');
    });
  });

  describe('arrayify', function() {
    it('should return original array', function() {
      assert.deepEqual(utils.arrayify(['foo', 'bar']), ['foo', 'bar']);
    });

    it('should return array when given a string', function() {
      assert.deepEqual(utils.arrayify('foo'), ['foo']);
    });

    it('should return array when given an object', function() {
      assert.deepEqual(utils.arrayify({foo: 'bar'}), [{foo: 'bar'}]);
    });

    it('should return array when given a function', function() {
      var foo = function() {};
      assert.deepEqual(utils.arrayify(foo), [foo]);
    });

    it('should return an empty array when given null', function() {
      assert.deepEqual(utils.arrayify(null), []);
    });

    it('should return an empty array when given undefined', function() {
      assert.deepEqual(utils.arrayify(), []);
    });

    it('should return an empty array when given false', function() {
      assert.deepEqual(utils.arrayify(false), []);
    });
  });

  describe('createAlias', function() {
    it('should throw an error when name is undefined', function(done) {
      try {
        utils.createAlias();
        done(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'expected name to be a string');
        done();
      }
    });

    it('should throw an error when name is not a string', function(done) {
      try {
        utils.createAlias({});
        done(new Error('expected an error'));
      } catch (err) {
        assert.equal(err.message, 'expected name to be a string');
        done();
      }
    });

    it('should return original name when name does not contain a -', function() {
      assert.equal(utils.createAlias('foo'), 'foo');
    });

    it('should return an alias when name contains a -', function() {
      assert.equal(utils.createAlias('generator-foo'), 'foo');
    });

    it('should return an alias when name contains multiple -', function() {
      assert.equal(utils.createAlias('generator-foo-bar'), 'foo-bar');
    });
  });

  describe('exists', function() {
    it('should return true for ' + __filename, function() {
      assert(utils.exists(__filename));
    });

    it('should return false for something-that-does-not-exist.txt', function() {
      assert(utils.exists('something-that-does-not-exist.txt') === false);
    });
  });

  describe('flatten', function() {

  });

  describe('globFiles', function() {
    it('should return files from process.cwd', function() {
      assert.deepEqual(utils.globFiles(['index.js']), [process.cwd() + '/index.js']);
    });

    it('should return files from custom cwd', function() {
      assert.deepEqual(utils.globFiles(['*.js'], {cwd: __dirname + '/fixtures/one'}), [__dirname + '/fixtures/one/generator.js']);
    });
  });

  describe('isDirectory', function() {
    it('should return true for ' + __dirname, function() {
      assert(utils.isDirectory(__dirname));
    });

    it('should return false for ' + __filename, function() {
      assert(utils.isDirectory(__filename) === false);
    });

    it('should return false for something-that-does-not-exist', function() {
      assert(utils.isDirectory(__dirname + '/something-that-does-not-exist') === false);
    });
  });

  describe('isEmpty', function() {
    it('should return false when the directory does not exist', function() {
      assert(utils.isEmpty(__dirname + '/something-that-does-not-exist/') === false);
    });

    it('should return false when the directory is not empty', function() {
      assert(utils.isEmpty(__dirname) === false);
    });

    it('should return true when an empty directory exists', function() {
      assert(utils.isEmpty(__dirname + '/fixtures/empty'));
    });

    it('should return true using custom filter function', function() {
      assert(utils.isEmpty(__dirname, function() { return false; }));
    });

    it('should return false using custom filter function', function() {
      assert(utils.isEmpty(__dirname, function() { return true; }) === false);
    });
  });

  describe('isObject', function() {
    it('should return true for an object', function() {
      assert(utils.isObject({}));
    });

    it('should return false for a function', function() {
      assert(utils.isObject(function() {}) === false);
    });

    it('should return false for a string', function() {
      assert(utils.isObject('foo') === false);
    });

    it('should return false for an array', function() {
      assert(utils.isObject([]) === false);
    });

    it('should return false for undefined', function() {
      assert(utils.isObject() === false);
    });

    it('should return false for null', function() {
      assert(utils.isObject(null) === false);
    });

    it('should return false for a number', function() {
      assert(utils.isObject(5) === false);
    });

    it('should return false for a boolean', function() {
      assert(utils.isObject(true) === false);
    });
  });

  describe('logger', function() {

  });

  describe('runtimes', function() {

  });

  describe('tableize', function() {

  });

  describe('timestamp', function() {

  });

  describe('toKey', function() {
    it('should make a key from a namespace and prop', function() {
      assert.equal(utils.toKey('generators', 'foo.bar'), 'generators.foo.generators.bar');
    });

    it('should make a key from a namespace and prop starting with the namespace', function() {
      assert.equal(utils.toKey('generators', 'generators.foo.bar'), 'generators.foo.generators.bar');
    });

    it('should make a key from a namespace and prop with multiple namespace segments', function() {
      assert.equal(utils.toKey('generators', 'generators.foo.generators.bar'), 'generators.foo.generators.bar');
    });
  });

  describe('tryRequire', function() {

  });

  describe('tryResolve', function() {

  });
});
