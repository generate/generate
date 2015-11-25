'use strict';

var async = require('async');
var Base = require('assemble-core');
var generator = require('./lib/generator');
var defaults = require('./lib/defaults');
var config = require('./lib/config');
var locals = require('./lib/locals');
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
 * var generators = new Generate();
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
  this.config = {};

  // this.use(generator(this.options));
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
  // custom middleware handlers
  this.handler('onStream');
  this.handler('preWrite');
  this.handler('postWrite');

  this.use(locals('generate'))
    .use(utils.store())
    .use(utils.pipeline())
    .use(utils.loader())

  this.engine(['md', 'text'], require('engine-base'));
  this.onLoad(/\.(md|tmpl)$/, function (view, next) {
    utils.matter.parse(view, next);
  });

  this.use(defaults());
};

/**
 * Register generator `name` with the given `config` and optionally
 * a `base` instance of `Generate` for storing the generator.
 *
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

  if (!base) base = this.base;
  base.loadMiddleware(require('./lib/middleware'));
  base.loadTasks(require('./lib/tasks/base'));

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

  // get the package.json for the module
  var pkg = utils.tryRequire(config.pkg);

  // get the module to instantiate for the generator
  // var Generator = modpath ? require(modpath) : this.Generator;// this.constructor;
  var Generator = modpath ? require(modpath) : this.constructor;
  var app = new Generator();
  app.define('paths', config);

  require('./lib/tasks/app/templates')(app);

  app.isGenerator = true;
  app.define('parent', base);

  app.use(utils.runtimes({
    displayName: function(key) {
      return utils.cyan(name + ':' + key);
    }
  }));

  this.invoke(fn, app, base);

  this.emit('register', config.alias, app);
  return (base.generators[config.alias] = app);
};

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
};

/**
 * Run one or more generators and the specified tasks for each.
 *
 * ```js
 * // run the specified tasks for generators `foo` and `bar`
 * var generators = {
 *   foo: ['a', 'b', 'c'],
 *   bar: ['x', 'y', 'z']
 * };
 * generate.generate(generators, function(err) {
 *   if (err) return console.log(err);
 *   console.log('done!');
 * });
 * ```
 * @param {Object} `generators`
 * @param {Function} `done`
 * @api public
 */

Generate.prototype.generate = function(generators, done) {
  if (!Array.isArray(generators) || !utils.isObject(generators[0])) {
    generators = this.argv(generators).generators;
  }

  async.each(generators, function(generator, cb) {
    async.eachOf(generator, function(tasks, name, next) {
      this.runTasks(name, tasks, next);
    }.bind(this), cb);
  }.bind(this), done);
};

Generate.prototype.runTasks = function(name, tasks, cb) {
  var generator = this.generator(name);
  if (!generator) {
    return cb(new Error('cannot find generator ' + name));
  }
  return generator.build(tasks, cb);
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
 * Generate a single `file` with the given `options`.
 */

Generate.prototype.file = function(file, options) {
  options = options || {};
  var opts = utils.extend({}, this.options, options, {
    expand: true
  });
  file = new File(file, opts);
  var pipeline = file.options.pipeline || options.pipeline;
  return utils.toStream(file)
    .pipe(utils.contents(opts))
    .pipe(this.pipeline(pipeline, opts))
    .pipe(this.dest(file.dest, opts))
};

function File(file, opts) {
  var dest = path.relative(process.cwd(), file.dest || opts.dest);
  for (var prop in file) {
    if (!opts.hasOwnProperty(prop)) {
      if (prop === 'src' || prop === 'dest' || prop === 'path') {
        continue;
      }
      opts[prop] = file[prop];
    }
  }
  file.path = file.path || file.src;
  opts.flatten = true;
  var res = utils.mapDest(file.path, dest, opts)[0];
  file = new utils.Vinyl({path: res.src});
  for (var key in res) {
    file[key] = res[key];
  }
  file.options = utils.extend({}, opts.options, opts);
  return file;
}

/**
 * Similar to [copy](#copy) but call a plugin `pipeline` if passed
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
  var opts = this.defaults(options);

  return this.src(files.src, opts)
    .pipe(this.pipeline(pipeline, opts))
    .pipe(this.dest(files.dest, opts))
};

/**
 * Parallel
 *
 * @param {Object} `config`
 * @param {Function} `cb`
 * @return {Object} Returns the instance for chaining
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
 * eachSeries
 *
 * @param {Object} `config`
 * @param {Function} `cb`
 * @return {Object} Returns the instance for chaining
 */

Generate.prototype.eachSeries = function(config, cb) {
  utils.async.eachSeries(config.files, function(files, next) {
    this.process(files, files.options)
      .on('error', next)
      .on('end', next);
  }.bind(this), cb);
  return this;
};


Object.defineProperty(Generate.prototype, 'base', {
  get: function() {
    return this.parent ? this.parent.base : this;
  }
});
