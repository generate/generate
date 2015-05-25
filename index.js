'use strict';

var path = require('path');
var diff = require('diff');
var chalk = require('chalk');
var through = require('through2');
var Template = require('template');
var tutil = require('template-utils')._;
var toVinyl = require('to-vinyl');
var Task = require('orchestrator');
var vfs = require('vinyl-fs');
var _ = require('lodash');

var session = require('./lib/session');
var plugins = require('./lib/plugins');
var stack = require('./lib/stack');
var utils = require('./lib/utils');
var init = require('./lib/init');

/**
 * Initialize `Generate`.
 *
 * @param {Object} `context`
 * @api private
 */

function Generate() {
  Template.apply(this, arguments);
  Task.apply(this, arguments);
  this.session = session;
  init(this);
}

_.extend(Generate.prototype, Task.prototype);
Template.extend(Generate.prototype);

/**
 * Register a plugin by `name`
 *
 * @param  {String} `name`
 * @param  {Function} `fn`
 * @api public
 */

Generate.prototype.plugin = function(name, fn) {
  if (arguments.length === 1) {
    return this.plugins[name];
  }
  if (typeof fn === 'function') {
    fn = fn.bind(this);
  }
  this.plugins[name] = fn;
  return this;
};

/**
 * Create a plugin pipeline from an array of plugins.
 *
 * @param  {Array} `plugins` Each plugin is a function that returns a stream, or the name of a registered plugin.
 * @param  {Object} `options`
 * @return {Stream}
 * @api public
 */

Generate.prototype.pipeline = function(plugins, options) {
  var res = [];
  for (var i = 0; i < plugins.length; i++) {
    var val = plugins[i];
    if (typeOf(val) === 'function') {
      res.push(val.call(this, options));
    } else if (typeOf(val) === 'object') {
      res.push(val);
    } else if (this.plugins.hasOwnProperty(val) && !this.isFalse('plugin ' + val)) {
      res.push(this.plugins[val].call(this, options));
    } else {
      res.push(through.obj());
    }
  }
  return es.pipe.apply(es, res);
};

/**
 * Glob patterns or filepaths to source files.
 *
 * ```js
 * generate.src('*.js')
 * ```
 *
 * **Example usage**
 *
 * ```js
 * generate.task('web-app', function() {
 *   generate.src('templates/*')
 *     generate.dest(process.cwd())
 * });
 * ```
 *
 * @param {String|Array} `glob` Glob patterns or file paths to source files.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
 * @api public
 */

Generate.prototype.src = function(glob, opts) {
  return stack.src(this, glob, opts);
};

/**
 * Specify a destination for processed files.
 *
 * ```js
 * generate.dest('dist', {ext: '.xml'})
 * ```
 *
 * @param {String|Function} `dest` File path or rename function.
 * @param {Object} `options` Options or locals to pass to `dest` plugins
 * @api public
 */

Generate.prototype.dest = function(dest, opts) {
  return stack.dest(this, dest, opts);
};

/**
 * Specify a destination for processed files.
 *
 * ```js
 * generate.templates('foo.tmpl')
 * ```
 *
 * @param {String|Function} `dest` File path or rename function.
 * @param {Object} `options` Options to `dest` plugins
 * @api public
 */

Generate.prototype.templates = function(glob, opts) {
  return stack.templates(this, glob, opts);
};

/**
 * Copy a `glob` of files to the specified `dest`.
 *
 * ```js
 * app.copy('assets/**', 'dist');
 * ```
 *
 * @param  {String|Array} `glob`
 * @param  {String|Function} `dest`
 * @return {Stream} Stream, to continue processing if necessary.
 * @api public
 */

Generate.prototype.copy = function(glob, dest, opts) {
  opts = _.extend({cwd: this.get('generator.cwd')}, opts);
  dest = path.resolve(process.cwd(), dest);
  return this.src(glob, opts)
    .pipe(vfs.dest(dest, opts));
};

/**
 * Set or get a generator function by `name`.
 *
 * ```js
 * // set an generator
 * app.generator('foo', require('generator-foo'));
 *
 * // get an generator
 * var foo = app.generator('foo');
 * ```
 * @param  {String} `name`
 * @param  {Function} `fn` The generator plugin function
 * @api public
 */

Generate.prototype.generator = function(name, fn) {
  if (arguments.length === 1 && typeof name === 'string') {
    return this.generators[name];
  }
  this.generators[name] = fn;
  return this;
};

/**
 * Define a task.
 *
 * ```js
 * generate.task('docs', function() {
 *   generate.src(['.generate.js', 'foo/*.js'])
 *     .pipe(generate.dest('./'));
 * });
 * ```
 *
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

Generate.prototype.task = Generate.prototype.add;

/**
 * Get the name of the current task-session. This is
 * used in plugins to lookup data or views created in
 * a task.
 *
 * ```js
 * var id = generate.getTask();
 * var views = generate.views[id];
 * ```
 *
 * @return {String} `task` The name of the currently running task.
 * @api public
 */

Generate.prototype.getTask = function() {
  var name = this.session.get('task');
  return typeof name !== 'undefined'
    ? 'task_' + name
    : 'taskFile';
};

/**
 * Get a view collection by its singular-form `name`.
 *
 * ```js
 * var collection = generate.getCollection('page');
 * // gets the `pages` collection
 * //=> {a: {}, b: {}, ...}
 * ```
 *
 * @return {String} `name` Singular name of the collection to get
 * @api public
 */

Generate.prototype.getCollection = function(name) {
  if (typeof name === 'undefined') {
    name = this.getTask();
  }

  if (this.views.hasOwnProperty(name)) {
    return this.views[name];
  }

  name = this.inflections[name];
  return this.views[name];
};

/**
 * Get a file from the current session.
 *
 * ```js
 * var file = generate.getFile(file);
 * ```
 *
 * @return {Object} `file` Vinyl file object. Must have an `id` property.
 * @api public
 */

Generate.prototype.getFile = function(file, id) {
  return this.getCollection(id)[file.id];
};

/**
 * Get a template from the current session, convert it to a vinyl
 * file, and push it into the stream.
 *
 * ```js
 * generate.pushToStream(file);
 * ```
 *
 * @param {Stream} `stream` Vinyl stream
 * @param {String} `id` Get the session `id` using `generate.getTask()`
 * @api public
 */

Generate.prototype.pushToStream = function(id, stream) {
  return tutil.pushToStream(this.getCollection(id), stream, toVinyl);
};

/**
 * `taskFiles` is a session-context-specific getter that
 * returns the collection of files from the currently running `task`.
 *
 * ```js
 * var taskFiles = generate.taskFiles;
 * ```
 *
 * @name .taskFiles
 * @return {Object} Get the files from the currently running task.
 * @api public
 */

Object.defineProperty(Generate.prototype, 'taskFiles', {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.views[this.inflections[this.getTask()]];
  }
});

/**
 * Run an array of tasks.
 *
 * ```js
 * generate.run(['foo', 'bar']);
 * ```
 *
 * @param {Array} `tasks`
 * @api private
 */

Generate.prototype.run = function() {
  var tasks = arguments.length ? arguments : ['default'];
  process.nextTick(function () {
    this.start.apply(this, tasks);
  }.bind(this));
};

/**
 * Wrapper around Task._runTask to enable `sessions`.
 *
 * @param  {Object} `task` Task to run
 * @api private
 */

Generate.prototype._runTask = function(task) {
  var self = this;
  self.session.run(function () {
    self.session.set('task', task.name);
    Task.prototype._runTask.call(self, task);
  });
};

/**
 * Re-run the specified task(s) when a file changes.
 *
 * ```js
 * generate.task('watch', function() {
 *   generate.watch('docs/*.md', ['docs']);
 * });
 * ```
 *
 * @param  {String|Array} `glob` Filepaths or glob patterns.
 * @param  {Function} `fn` Task(s) to watch.
 * @api public
 */

Generate.prototype.watch = function(glob, opts, fn) {
  if (Array.isArray(opts) || typeof opts === 'function') {
    fn = opts; opts = null;
  }
  if (!Array.isArray(fn)) return vfs.watch(glob, opts, fn);
  return vfs.watch(glob, opts, function () {
    this.start.apply(this, fn);
  }.bind(this));
};

/**
 * Display a visual representation of the
 * difference between `a` and `b`
 */

Generate.prototype.diff = function(a, b, method) {
  method = method || 'diffJson';
  a = a || this.env;
  b = b || this.cache.data;
  diff[method](a, b).forEach(function (res) {
    var color = chalk.gray;
    if (res.added) {
      color = chalk.green;
    }
    if (res.removed) {
      color = chalk.red;
    }
    process.stderr.write(color(res.value));
  });
  console.log('\n');
};

/**
 * Expose the `Generate` class on `generate.Generate`
 */

Generate.prototype.Generate = Generate;

/**
 * Expose our instance of `generate`
 */

module.exports = new Generate();
