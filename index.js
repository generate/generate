/*!
 * generate <https://github.com/jonschlinkert/generate>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var extend = require('lodash')._.extend;
var through = require('through2');
var Template = require('template');
var Task = require('orchestrator');
var vfs = require('vinyl-fs');
var plugins = require('./lib/plugins');
var session = require('./lib/session');
var stack = require('./lib/stack');
var init = require('./lib/init');

/**
 * Create a `generate` generator.
 *
 * ```js
 * var app = require('generate');
 * ```
 *
 * @api public
 */

function Generate(opts) {
  Template.call(this, opts);
  Task.call(this, opts);
  this.transforms = this.transforms || {};
  this.session = session;
  init(this);
}

extend(Generate.prototype, Task.prototype);
Template.extend(Generate.prototype);

/**
 * Glob patterns or filepaths to source files.
 *
 * ```js
 * app.src('*.js')
 * ```
 *
 * **Example usage**
 *
 * ```js
 * app.task('web-app', function() {
 *   app.src('templates/*')
 *     app.dest(process.cwd())
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
 * Glob patterns or filepaths to templates stored in the
 * `./templates` directory of a generator.
 *
 * ```js
 * app.templates('*.js')
 * ```
 *
 * **Example usage**
 *
 * ```js
 * app.task('web-app', function() {
 *   app.templates('templates/*')
 *     app.dest(process.cwd())
 * });
 * ```
 *
 * @param {String|Array} `glob` Glob patterns or file paths to source files.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
 * @api public
 */

Generate.prototype.templates = function(glob, opts) {
  var cwd = path.resolve(this.templates);
  glob = path.resolve(this.templates, glob);
  return stack.templates(this, glob, {cwd: cwd});
};

/**
 * Specify a destination for processed files.
 *
 * ```js
 * app.dest('dist', {ext: '.xml'})
 * ```
 *
 * **Example usage**
 *
 * ```js
 * app.task('sitemap', function() {
 *   app.src('templates/*')
 *     app.dest('dist', {ext: '.xml'})
 * });
 * ```
 *
 * @param {String|Function} `dest` File path or rename function.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `dest` plugins
 * @api public
 */

Generate.prototype.dest = function(dest, opts) {
  return stack.dest(this, dest, opts);
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
 * @return {Stream} Stream to allow doing additional work.
 */

Generate.prototype.copy = function(glob, dest, opts) {
  return vfs.src(glob, opts).pipe(vfs.dest(dest, opts));
};

/**
 * Plugin for processing templates using any registered engine.
 * If this plugin is NOT used, engines will be selected based
 * on file extension.
 *
 * ```js
 * app.process();
 * ```
 *
 * @param  {String|Array} `glob`
 * @param  {String|Function} `dest`
 * @return {Stream} Stream to allow doing additional work.
 */

Generate.prototype.process = function(locals, options) {
  locals = extend({id: this.gettask()}, this.cache.data, locals);
  locals.options = extend({}, this.options, options, locals.options);
  return through.obj(plugins.process.call(this, locals, options));
};

/**
 * Define a generator.
 *
 * ```js
 * app.task('docs', function() {
 *   app.src('*.js').pipe(app.dest('.'));
 * });
 * ```
 *
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

Generate.prototype.task = Generate.prototype.add;

/**
 * Get the name of the currently running task. This is
 * primarily used inside plugins.
 *
 * ```js
 * app.gettask();
 * ```
 *
 * @return {String} `task` The currently running task.
 * @api public
 */

Generate.prototype.gettask = function() {
  var name = this.session.get('task');
  return typeof name != 'undefined'
    ? 'task_' + name
    : 'file';
};

/**
 * Transforms functions are used to exted the `Generate` object and
 * are run immediately upon init and are used to extend or modify
 * anything on the `this` object.
 *
 * ```js
 * app.transform('foo', function(app) {
 *   app.cache.foo = app.cache.foo || {};
 * });
 * ```
 *
 * @param {String} `name` The name of the transform to add.
 * @param {Function} `fn` The actual transform function.
 * @return {Object} Returns `Generate` for chaining.
 * @api public
 */

Generate.prototype.transform = function(name, fn) {
  if (fn && typeof fn === 'function') {
    this.transforms[name] = fn;
    fn.call(this, this);
  }
  return this;
};

/**
 * Set or get a generator function by `name`.
 *
 * This isn't how generators will work, it's just a placeholder.
 * They will probably be more like "bundles" (as @doowb calls them :)
 * and might consiste of plugins, middleware, templates etc.
 */

Generate.prototype.generator = function(name, fn) {
  if (arguments.length === 1 && typeof name === 'string') {
    return this.generators[name];
  }
  this.generators[name] = fn;
  return this;
};

/**
 * Run an array of tasks.
 *
 * ```js
 * app.run(['foo', 'bar']);
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
 * Re-run the specified task(s) when a file changes.
 *
 * ```js
 * app.task('watch', function() {
 *   app.watch('docs/*.md', ['docs']);
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

  if (!Array.isArray(fn)) vfs.watch(glob, opts, fn);
  return vfs.watch(glob, opts, function () {
    this.start.apply(this, fn);
  }.bind(this));
};

/**
 * Expose the `Generate` class on `generate.Generate`
 */

Generate.prototype.Generate = Generate;

/**
 * Expose an instance of `generate`
 */

module.exports = new Generate();
