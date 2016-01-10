'use strict';

var path = require('path');
var async = require('async');
var Base = require('assemble-core');
var Logger = require('./lib/logger');
var build = require('./lib/build');
var utils = require('./lib/utils');
var cli = require('./lib/cli');
var Env = require('./lib/env');

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

function Generate(options) {
  if (!(this instanceof Generate)) {
    return new Generate(options);
  }

  this.env = {};
  this.fn = require('./generator.js');

  Base.apply(this, arguments);
  if (this.name === 'Templates') {
    this.name = 'generate';
  }

  this.isGenerate = true;
  this.generators = {};
  this.tree = {};

  this.defaultPlugins();
  this.use(build());
}

/**
 * Inherit assemble-core
 */

Base.extend(Generate);

/**
 * Initialize `Generate` plugins.
 *  | base-store
 *  | base-pipeline
 *  | base-questions
 *  | common middleware
 *  | composer-runtimes
 *  | base-cli
 *  | base-tree
 *  | config.store
 */

Generate.prototype.defaultPlugins = function() {
  this.log = new Logger();
  this.use(utils.store())
    .use(utils.pipeline())
    .use(utils.ask({storeName: 'generate'}))
    .use(utils.middleware())
    .use(utils.runtimes())
    .use(utils.argv())
    .use(cli())
    .use(utils.list('generators', {
      method: 'generator'
    }));

  this.store.create('config');
};

/**
 * Get or register a generator.
 *
 * @param {String} `name` The generator name
 * @param {Object|Function} `app` Generator instance or function.
 * @param {Object} `env` Instance of `Env`
 * @return {Object}
 */

Generate.prototype.generator = function(name, app, env) {
  if (typeof name === 'string' && arguments.length === 1) {
    return this.getGenerator(name);
  }
  return this.register.apply(this, arguments);
};

/**
 * Get generator `name`.
 *
 * ```js
 * generate.getGenerator('node')
 *   .build('default', function(err) {
 *     if (err) throw err;
 *     console.log('done!');
 *   });
 * ```
 * @param {String} `name`
 * @return {Object} Returns a generator object, which is an instance of generate.
 * @api public
 */

Generate.prototype.getGenerator = function(name) {
  var app = this.get(utils.toKey('generators', name));
  if (app) return app;

  if (name.indexOf('base.') !== 0) {
    name = 'base.' + name;
    return this.get(utils.toKey('generators', name));
  }
};

/**
 * Register a generator by `name` with either an instance of generate,
 * or a generator function, and an optional `environment` object.
 *
 * ```js
 * // instance of generate
 * var app = new Generate();
 * generate.register('webapp', app);
 *
 * // generator function
 * generate.register('webapp', function(app, base, env) {
 *   // do stuff
 * });
 * ```
 * @param {String} `name`
 * @param {Object|Function} `app` An instance of generate or a generator function.
 *   _Globally installed generators must be exposed as functions_. Each has pros and
 *   cons, see the [generators docs](./docs/generators.md) for more details.
 * @param {Object} `env`
 * @return {Object} returns the generator instance.
 * @api publich
 */

Generate.prototype.register = function(name, app, env) {
  if (typeof app === 'string') {
    return this.registerPath(name, app, env);
  }

  function createInstance(app, parent, fn) {
    var base = parent.base;
    app.name = name;
    app.env = env || base.env;
    app.define('parent', parent);
    if (typeof fn === 'function') {
      app.fn = fn;
      fn.call(app, app, base, app.env);
    }
  }

  if (utils.isObject(app) && app.isGenerate) {
    createInstance(app, this, app.fn);

  } else if (typeof app === 'function') {
    var Generator = this.constructor;
    var fn = app;
    app = new Generator({name: name});
    createInstance(app, this, fn);

  } else {
    createInstance(app, this);
  }

  this.addLeaf(name, app);
  this.generators[name] = app;
  return app;
};

/**
 * Register generator `name` by the given filepath. This method wraps
 * the `register` method to simplify adding generators by path.
 *
 * See the [register](#register) method for more details.
 *
 * @param {String} `name` The generator name
 * @param {Object} `filepath` The filepath of the generator.
 * @param {Object} `env`
 * @return {Object}
 * @api public
 */

Generate.prototype.registerPath = function(name, filepath, env) {
  if (typeof filepath === 'object' && filepath.config) {
    env = filepath;
    filepath = name;
  }

  var fp = utils.tryResolve(filepath);
  if (!utils.exists(fp)) {
    var err = new Error('cannot resolve generator: ' + filepath);
    err.args = arguments;
    throw err;
  }

  if (name === filepath) {
    name = utils.createAlias(filepath);
  }
  return this.register(name, require(fp), env);
};

/**
 * Extend generator `app` with any tasks, sub-generators or other
 * settings on the `base` instance.
 *
 * ```js
 * generate.register('my-extended-generator', function(app, base) {
 *   base.extendGenerator(app);
 * });
 * ```
 * @param {Object} `app` Specified instance of generate.
 * @param {Object} `base` The base instance of generate
 * @return {Object}
 * @api public
 */

Generate.prototype.extendGenerator = function(app, base) {
  if (typeof this.fn !== 'function') {
    throw new Error('generators must export a function to extend other generators');
  }
  base = base || this;
  base.fn.call(app, app, this.base, app.env);
  return app;
};

/**
 * Extend generator `app` with the tasks, sub-generators, and other settings
 * of one or more additional generators.
 *
 * ```js
 * var foo = generate.getGenerator('foo');
 * generate.compose(foo, ['bar', 'baz', 'qux']);
 * ```
 * @param {Object} `app` Instance of generate.
 * @param {String|Array} `names` Names of generators to compose with `app`.
 * @return {Object}
 * @api public
 */

Generate.prototype.compose = function(app, names) {
  if (utils.typeOf(app) !== 'object') {
    throw new TypeError('expected an object');
  }

  var args = [].concat.apply([], [].slice.call(arguments, 1));
  var len = args.length;
  var idx = -1;

  while (++idx < len) {
    var name = args[idx];
    var inst = this.generator(name);
    app = this.extendGenerator(app, inst);
  }

  return app;
};

/**
 * Similar to [copy](#copy) but calls a plugin `pipeline` if passed
 * on the `options`. This allows plugin pipelines to be programmatically
 * built-up and dynamically changed on-the-fly.
 *
 * ```js
 * generate.process({src: ['a.txt', 'b.txt']}, options);
 * ```
 * @param {Object} `files`
 * @param {Object} `options`
 * @param {Function} `cb`
 * @return {Stream} Returns a [vinyl][] stream
 * @api public
 */

Generate.prototype.process = function(files, options) {
  var opts = createOptions(this, files, options);
  var cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();
  files.dest = path.resolve(cwd, files.dest);

  return this.src(files.src, opts)
    .pipe(this.pipeline(opts.pipeline, opts))
    .on('error', this.emit.bind(this, 'error'))
    .pipe(utils.exhaust(this.dest(files.dest, opts)));
};

/**
 * Generate `files` configurations in parallel.
 *
 * ```js
 * generate.each(files, function(err) {
 *   if (err) throw err;
 *   console.log('done!');
 * });
 * ```
 * @param {Object} `config`
 * @param {Function} `cb` Optional callback function. Calls `.eachStream` and returns a stream when callback is not passed.
 * @api public
 */

Generate.prototype.each = function(config, cb) {
  if (typeof cb !== 'function') {
    return this.eachStream(config);
  }
  this.data(config.data || config.options.data || {});
  async.each(config.files, function(files, next) {
    this.process(files, files.options)
      .on('error', next)
      .on('finish', next);
  }.bind(this), cb);
  return this;
};

/**
 * Generate `files` configurations in series.
 *
 * ```js
 * var expand = require('expand-files');
 * var config = expand.config({src: '*', dest: 'foo/'});
 * generate.eachSeries(config, function(err) {
 *   if (err) throw err;
 *   console.log('done!');
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
      .on('finish', next);
  }.bind(this), cb);
};

/**
 * Generate `files` configurations in parallel.
 *
 * ```js
 * generate.each(files)
 *   .on('error', console.error)
 *   .on('end', function() {
 *     console.log('done!');
 *   });
 * ```
 * @param {Object} `config`
 * @return {Stream} returns stream with all process files
 * @api public
 */

Generate.prototype.eachStream = function(config) {
  this.data(config.data || config.options.data || {});
  var streams = [];

  config.files.forEach(function(files) {
    streams.push(utils.src(this.process(files, files.options)));
  }.bind(this));

  var stream = utils.ms.apply(utils.ms, streams);
  stream.on('finish', stream.emit.bind(stream, 'end'));
  return stream;
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
 * @param {Object} `scaffold` Scaffold configuration object.
 * @param {Function} `cb` Optional callback function. If not passed, `.scaffoldStream` will be called and a stream will be returned.
 * @api public
 */

Generate.prototype.scaffold = function(scaffold, cb) {
  if (typeof cb !== 'function') {
    return this.scaffoldStream(scaffold);
  }

  utils.timestamp('starting scaffold');
  async.eachOf(scaffold, function(target, name, next) {
    if (!target.files) {
      next();
      return;
    }
    utils.timestamp('building target ' + name);
    this.each(target, next);
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
 * generate.scaffoldStream(scaffold)
 *   .on('error', console.error)
 *   .on('end', function() {
 *     console.log('done!');
 *   });
 * ```
 * @param {Object} `scaffold` [scaffold][] configuration object.
 * @return {Stream} returns a stream with all processed files.
 * @api public
 */

Generate.prototype.scaffoldStream = function(scaffold) {
  utils.timestamp('starting scaffold');
  var streams = [];
  for(var name in scaffold) {
    var target = scaffold[name];
    if (!target.files) {
      continue;
    }
    utils.timestamp('building target ' + name);
    streams.push(utils.src(this.eachStream(target)));
  }
  var stream = utils.ms.apply(utils.ms, streams);
  stream.on('finish', stream.emit.bind(stream, 'end'));
  return stream;
};

/**
 * Add a generator and its tasks to the tree object.
 * Mostly used for debugging, but also useful for
 * creating custom-formatted visual trees.
 *
 * @param {String} `name`
 * @param {Object} `app`
 */

Generate.prototype.addLeaf = function(name, app) {
  this.tree[name] = {};
  this.tree[name].tasks = Object.keys(app.tasks || {});
  this.tree[name].generators = app.tree;
  return this;
};

/**
 * Set the `name` on the instance, or get the `name` from the instance.
 * Used for lookups and logging messages.
 *
 * ```js
 * var name = generate.name;
 * ```
 *
 * @api public
 */

Object.defineProperty(Generate.prototype, 'name', {
  configurable: true,
  set: function(val) {
    this.define('_name', val);
  },
  get: function() {
    if (this._name) {
      return this._name;
    }
    var name = this._appname || this._name || this.options.name || 'base';
    return (this._name = name);
  }
});

/**
 * Get the `base` instance from the current instance of `generate`.
 *
 * ```js
 * var base = generate.base;
 * ```
 * @api public
 */

Object.defineProperty(Generate.prototype, 'base', {
  configurable: true,
  get: function() {
    return this.generators.base || (this.parent ? this.parent.base : this);
  }
});

/**
 * Create the options object to used by the `process` method
 */

function createOptions(app, files, options) {
  options = options || {};
  files.options = files.options || {};
  var opts = utils.merge({}, app.options, files.options, options);
  opts.cwd = path.resolve(opts.cwd || process.cwd());
  app.data(opts.data || {});
  return opts;
}

/**
 * Expose `Generate`
 */

module.exports = Generate;

/**
 * Expose `Env`
 */

module.exports.Env = Env;
