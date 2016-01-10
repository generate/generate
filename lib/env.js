'use strict';

var path = require('path');
var Emitter = require('component-emitter');
var utils = require('./utils');

function Env(configfile, modulename, cwd) {
  if (typeof configfile !== 'string') {
    throw new TypeError('expected configfile to be a string');
  }
  if (typeof modulename !== 'string') {
    throw new TypeError('expected modulename to be a string');
  }
  if (typeof cwd !== 'string') {
    throw new TypeError('expected cwd to be a string');
  }

  utils.define(this, 'cache', {});
  this.configs = {};

  this.cwd = cwd || process.cwd();
  this.config = new Config({file: configfile, cwd: this.cwd});
  this.module = { name: modulename };

  this.user = new User(process.cwd());

  this.createEnv = function(configfile, cwd) {
    return new Env(configfile, modulename, cwd);
  };
}

Emitter(Env.prototype);

Env.prototype.resolve = function(patterns, options) {
  var opts = utils.extend({cwd: process.cwd()}, options);
  var configfile = opts.configfile || this.config.file;

  var files = utils.glob.sync(patterns, opts);
  this.module.path = this.module.path || utils.tryResolve(this.module.name);
  var len = files.length;
  var i = -1;

  while (++i < len) {
    var name = files[i];
    var fp = path.resolve(opts.cwd, name);

    // if the module is already cached, skip it
    if (this.cache[fp]) continue;
    this.cache[fp] = true;

    var env = this.createEnv(configfile, path.dirname(fp));
    env.module.path = this.module.path;
    if (!env.config.path) continue;

    this.emit('config', env.config.alias, env);
    this.configs[path.dirname(name)] = env;
  }
  return this;
};

function User(cwd) {
  utils.define(this, 'cache', {});
  this.cwd = cwd ? path.resolve(cwd) : process.cwd();
  this.isEmpty = utils.isEmpty(this.cwd);

  if (this.isEmpty) {
    this.pkgPath = null;
    this.pkg = null;
    return;
  }

  // update cwd to use `dirname`
  this.pkgPath = utils.findPkg.sync(this.cwd);

  Object.defineProperty(this, 'pkg', {
    configurable: true,
    enumerable: true,
    set: function(pkg) {
      this.cache.pkg = pkg;
    },
    get: function() {
      if (this.cache.pkg) {
        return this.cache.pkg;
      }
      return (this.cache.pkg = utils.tryRequire(this.pkgPath));
    }
  });
}

function Config(config) {
  utils.define(this, 'cache', {});

  this.file = config.file;
  this.path = path.join(config.cwd, this.file);
  if (!utils.exists(this.path)) {
    this.path = null;
    return;
  }

  // update cwd to use `dirname`
  this.cwd = path.dirname(this.path);
  this.pkgPath = utils.findPkg.sync(this.cwd);

  Object.defineProperty(this, 'alias', {
    configurable: true,
    enumerable: true,
    set: function(val) {
      this.cache.alias = val;
    },
    get: function() {
      if (this.cache.alias) {
        return this.cache.alias;
      }
      this.cache.alias = utils.createAlias(this.name);
      return this.cache.alias;
    }
  });

  Object.defineProperty(this, 'name', {
    configurable: true,
    enumerable: true,
    set: function(val) {
      this.cache.name = val;
    },
    get: function() {
      if (this.cache.name) {
        return this.cache.name;
      }
      this.cache.name = (this.pkg.name || path.basename(this.cwd));
      return this.cache.name;
    }
  });

  Object.defineProperty(this, 'pkg', {
    configurable: true,
    enumerable: true,
    set: function(pkg) {
      this.cache.pkg = pkg;
    },
    get: function() {
      if (this.cache.pkg) {
        return this.cache.pkg;
      }
      this.cache.pkg = utils.tryRequire(this.pkgPath);
      this.name = this.cache.pkg.name;
      return this.cache.pkg;
    }
  });

  Object.defineProperty(this, 'fn', {
    configurable: true,
    enumerable: true,
    set: function(val) {
      this.cache.fn = val;
    },
    get: function() {
      if (this.cache.fn) {
        return this.cache.fn;
      }
      this.cache.fn = require(this.path);
      this.fn = this.cache.fn;
      return this.cache.fn;
    }
  });
}

/**
 * Expose `Env`
 */

module.exports = Env;
