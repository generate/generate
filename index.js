'use strict';

// require('time-require');
var path = require('path');
var async = require('async');
var Base = require('assemble-core');
var utils = require('./lib/utils');
var cli = require('./lib/cli');

/**
 * Create an instance of `Generate` with the given `options`
 *
 * ```js
 * var Generate = require('generate');
 * var generate = new Generate(options);
 * ```
 * @param {Object} `options` Configuration options to initialize with.
 * @api public
 */

function Generate(options, preload) {
  if (!(this instanceof Generate)) {
    return new Generate(options);
  }

  var self = this;
  this.env = {};
  this.fn = null;

  Base.apply(this, arguments);
  this.isGenerate = true;
  this.generators = {};
  this.tree = {};

  this
    .use(utils.store())
    .use(utils.ask({storeName: 'generate'}))
    .use(utils.middleware())
    .use(utils.runtimes())
    .use(utils.list('generators', {
      method: 'generator'
    }))
    .use(cli())

  this.store.create('config');
  utils.build(this);
}

/**
 * Inherit assemble-core
 */

Base.extend(Generate);

Generate.prototype.addLeaf = function(name, app) {
  this.tree[name] = {};
  this.tree[name].tasks = Object.keys(app.tasks);
  this.tree[name].generators = app.tree;
  return this;
};

Generate.prototype.compose = function(name, app) {
  if (utils.typeOf(name) === 'object') {
    this.extendGenerator(name);
    return this;
  }
  this.generator(name).extendGenerator(app);
  return this;
};

Generate.prototype.generator = function(name, app, env) {
  if (typeof name === 'string' && arguments.length === 1) {
    var key = 'generators.' + name.split('.').join('.generators.');
    return this.get(key);
  }
  return this.register.apply(this, arguments);
};

Generate.prototype.registerPath = function(name, app, env) {
  this.register(name, require(path.resolve(app)), env);
  return this;
};

Generate.prototype.register = function(name, app, env) {
  if (typeof app === 'string') {
    return this.registerPath(name, app, env);
  }

  if (typeof app === 'function') {
    var fn = app;
    app = new Generate();
    createInstance(app, this.base, fn);
  } else {
    createInstance(app, this.base);
  }

  function createInstance(app, base, fn) {
    app.name = name;
    app.env = env || base.env;
    if (typeof fn === 'function') {
      app.define('parent', base);
      app.fn = fn;
      fn.call(app, app, base, app.env);
    }
  }

  this.addLeaf(name, app);
  this.generators[name] = app;
  return app;
};

Generate.prototype.extendGenerator = function(generator) {
  if (typeof this.fn !== 'function') {
    throw new Error('generators must export a function to extend other generators');
  }
  this.fn.call(generator, generator, this.base, generator.env);
  return this;
};

Generate.prototype.mkdir = function(dir) {

};

Generate.prototype.mkdirSync = function(dir) {

};

/**
 * Similar to [copy](#copy) but calls a plugin `pipeline` if passed
 * on the `options`. This allows plugin pipelines to be programmatically
 * built-up and dynamically changed on-the-fly.
 *
 * ```js
 * generate.process({src: ['a.txt', 'b.txt']}, options);
 * ```
 *
 * @param {Object} `files`
 * @param {Object} `options`
 * @param {Function} `cb`
 * @return {Stream} Returns a [vinyl][] src stream
 * @api public
 */

Generate.prototype.process = function(files, options) {
  options = options || {};
  files.options = files.options || {};
  var pipeline = files.options.pipeline || options.pipeline;
  var opts = utils.extend({}, this.options, files.options, options);

  return this.src(files.src, opts)
    .pipe(this.pipeline(pipeline, opts))
    .pipe(this.dest(files.dest, opts));
};

/**
 * Generate `files` configurations in parallel.
 *
 * ```js
 * generate.each(files, function(err) {
 *   if (err) console.log(err);
 * });
 * ```
 * @param {Object} `config`
 * @param {Function} `cb`
 * @api public
 */

Generate.prototype.each = function(config, cb) {
  async.each(config.files, function(files, next) {
    this.process(files, files.options)
      .on('error', next)
      .on('end', next);
  }.bind(this), cb);
  return this;
};

/**
 * Generate `files` configurations in series.
 *
 * ```js
 * generate.eachSeries(files, function(err) {
 *   if (err) console.log(err);
 * });
 * ```
 * @param {Object} `config`
 * @param {Function} `cb`
 * @api public
 */

Generate.prototype.eachSeries = function(config, cb) {
  async.eachSeries(config.files, function(files, next) {
    this.process(files, files.options)
      .on('error', next)
      .on('end', next);
  }.bind(this), cb);
};

/**
 * Generate files from a declarative [scaffold][] configuration.
 *
 * ```js
 * var Scaffold = require('scaffold');
 * var scaffold = new Scaffold({
 *   options: {cwd: 'source'},
 *   posts: {
 *     src: ['content/*.md']
 *   },
 *   pages: {
 *     src: ['templates/*.hbs']
 *   }
 * });
 *
 * generate.scaffold(scaffold, function(err) {
 *   if (err) console.log(err);
 * });
 * ```
 * @param {Object} `scaffold` Scaffold configuration
 * @param {Function} `cb` Callback function
 * @api public
 */

Generate.prototype.scaffold = function(scaffold, cb) {
  async.eachOf(scaffold, function(target, name, next) {
    this.each(target, next);
  }.bind(this), cb);
};

/**
 * Set the name on the instance
 */

Object.defineProperty(Generate.prototype, 'name', {
  configurable: true,
  set: function(val) {
    this.define('_name', val);
  },
  get: function() {
    return this._name || this.options.name || 'base';
  }
});

/**
 * Get the `base` instance
 */

Object.defineProperty(Generate.prototype, 'base', {
  configurable: true,
  get: function() {
    return this.generators.base || (this.parent ? this.parent.base : this);
  }
});

/**
 * Expose `Generate`
 */

module.exports = Generate;
