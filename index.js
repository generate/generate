'use strict';

var async = require('async');
var argv = require('base-argv');
var Base = require('assemble-core');
var proto = Base.prototype;

// var generator = require('./lib/generator');
var middleware = require('./lib/middleware');
var templates = require('./lib/templates');
var metadata = require('./lib/metadata');
var runtimes = require('./lib/runtimes');
var defaults = require('./lib/defaults');
var config = require('./lib/config');
var tasks = require('./lib/tasks');
var utils = require('./lib/utils');
var cli = require('./lib/cli');

/**
 * Expose `Generate`
 */

module.exports = Generate;

/**
 * Create an instance of `Generate` with the given `options`.
 *
 * ```js
 * var generators = new Generate(options);
 * ```
 * @param {Object} `options`
 * @api public
 */

function Generate(options) {
  if (!(this instanceof Generate)) {
    return new Generate(options);
  }

  Base.call(this);
  cli(this);

  this.options = options || {};
  this.name = 'generate';
  this.isGenerate = true;
  this.isGenerator = false;
  this.generators = {};
  this.initGenerate();
}

/**
 * Inherit 'Base'
 */

Base.extend(Generate);

/**
 * Initialize Generate defaults
 */

Generate.prototype.initGenerate = function() {
  this.use(defaults());

  this.use(argv({plural: 'generators'}))
    .use(metadata('generate'))
    .use(utils.store())
    .use(utils.pipeline())

  this.engine(['md', 'text'], require('engine-base'));
  this.onLoad(/\.(md|tmpl)$/, function(view, next) {
    utils.matter.parse(view, next);
  });

  this.once('base-loaded', function(base) {
    base.loadMiddleware(middleware);
    // base.loadTasks(tasks);
    tasks(this, base);
  });

  this.on('generator', function(app) {
    templates(app);
  });
};

/**
 * Register generator `name` with the given `config` and optionally
 * a `base` instance of `Generate` for storing the generator.
 *
 * ```js
 * generate.generator('gulp', function(app, base, env) {
 *   // `app` is the generator instance
 *   // `base` is a shared instance (across all generators)
 *   // `env` is an object with user and generator details
 * });
 * ```
 * @param {String} `name`
 * @param {Object} `config`
 * @param {Object} `base`
 * @return {Object} Returns the created generator instance.
 * @api public
 */

Generate.prototype.generator = function(name, config, base) {
  if (arguments.length === 1 && typeof name === 'string') {
    return this.generators[name] || this;
  }

  // get the base instance when the first generator is loaded.
  if (!base) base = this.base;
  this.emit('base-loaded', base);

  var fn;
  if (typeof config === 'function') {
    fn = config;
    config = { alias: name };
  } else {
    var filepath = config.configPath;
    var modpath = config.modulePath;

    // get the generator function
    fn = require(filepath);
  }

  if (typeof fn !== 'function') {
    throw new Error('failed to require generator ' + filepath);
  }


  // get the module to instantiate for the generator
  // var Generator = modpath ? require(modpath) : this.Generator;// this.constructor;
  var Generator = modpath ? require(modpath) : this.constructor;
  var app = new Generator();
  if (!app.isGenerate) {
    app = new this.constructor();
  }

  var pkg = require('load-pkg').sync(process.cwd());
  if (pkg) app.data(pkg);

  app.set('paths', config);
  app.isGenerator = true;
  app.define('parent', base);

  app.use(utils.runtimes({
    displayName: function(key) {
      return name + ':' + key;
    }
  }));

  this.invoke(fn, app, base);
  this.emit('register', config.alias, app);
  this.emit('generator', app);

  return (base.generators[config.alias] = app);
};

Generate.prototype.register = function() {
  return this.generator.apply(this, arguments);
};

/**
 * Invoke a generator `fn` with the given `app` and `base instances.
 *
 * ```js
 * fn.call(app, app, base);
 * ```
 * @param {Function} `fn`
 * @param {Object} `app`
 * @param {Object} `base`
 * @return {Object}
 */

Generate.prototype.invoke = function(fn, app, base) {
  if (typeof fn !== 'function') {
    throw new TypeError('expected generator to be a function');
  }
  try {
    base = base || this.base || this;
    fn.call(app, app, base, base.env);

  } catch (err) {
    err.message = 'Generator "'
      + config.alias + '": '
      + err.message;
    this.emit('error', err);
  }
  return this;
};

/**
 * Run one or more generators and the specified tasks for each.
 *
 * ```js
 * // run the default tasks for generators `foo` and `bar`
 * generate.runGenerators(['foo', 'bar'], function(err) {
 *   if (err) return console.log(err);
 *   console.log('done!');
 * });
 *
 * // run the specified tasks for generators `foo` and `bar`
 * var generators = {
 *   foo: ['a', 'b', 'c'],
 *   bar: ['x', 'y', 'z']
 * };
 *
 * generate.runGenerators(generators, function(err) {
 *   if (err) return console.log(err);
 *   console.log('done!');
 * });
 * ```
 * @param {Object} `generators`
 * @param {Function} `done`
 * @api public
 */

Generate.prototype.runGenerators = function(generators, done) {
  if (!Array.isArray(generators) || !utils.isObject(generators[0])) {
    generators = this.argv(generators).generators;
  }

  async.each(generators, function(generator, cb) {
    async.eachOf(generator, function(tasks, name, next) {
      var generator = this.generator(name);
      if (!generator) {
        return cb(new Error('cannot find generator ' + name));
      }
      return generator.build(tasks, cb);
    }.bind(this), cb);
  }.bind(this), done);
};

/**
 * Get a generator
 *
 * ```js
 * generators.getGenerator('a.html');
 * ```
 * @param {String} `key` Key of the generator to get.
 * @return {Object}
 * @api public
 */

Generate.prototype.getGenerator = function(key) {
  if (key.indexOf('.') === -1) {
    key = 'generators.' + key;
  } else {
    key = key.split('.').join('.generators.');
  }
  key = key.split(':').join('.tasks.');
  return this.get(key);
};

/**
 * Generate `src` patterns on a single `file` object.
 *
 * @param {Object} `file`
 * @param {Object} `options`
 * @return {Stream}
 * @api public
 */

Generate.prototype.file = function(file, options) {
  var opts = utils.extend({}, this.options, options, {expand: true});
  file = new utils.File(file, opts);
  var pipeline = file.options.pipeline || (options && options.pipeline);
  return utils.toStream(file)
    .pipe(utils.contents(opts))
    .pipe(this.pipeline(pipeline, opts))
    .pipe(this.dest(file.dest, opts));
};

/**
 * Similar to [copy](#copy) but calls a plugin `pipeline` if passed
 * on the `config` or `options`.
 *
 * @param {Object} `config`
 * @param {Object} `options`
 * @param {Function} `cb`
 * @return {Object}
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
 * generate.eachSeries(files, function(err) {
 *   if (err) console.log(err);
 * });
 * ```
 * @param {Object} `config`
 * @param {Function} `cb`
 * @api public
 */

Generate.prototype.each = function(config, cb) {
  utils.async.each(config.files, function(files, next) {
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
  utils.async.eachSeries(config.files, function(files, next) {
    this.process(files, files.options)
      .on('error', next)
      .on('end', next);
  }.bind(this), cb);
};

/**
 * Generate a scaffold. See the [scaffold][] library for details.
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
  utils.async.eachOf(scaffold, function(target, name, next) {
    this.each(target, next);
  }.bind(this), cb);
};

/**
 * Get the base generate instance. Each Generator is an instance of
 * Generate that is cached on the first instance of Generate. This
 * getter ensures that `base` is always the first instance.
 */

Object.defineProperty(Generate.prototype, 'base', {
  get: function() {
    return this.parent ? this.parent.base : this;
  }
});
