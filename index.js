/*!
 * generate <https://github.com/jonschlinkert/generate>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var extend = require('lodash')._.extend;
var Template = require('template');
var Task = require('orchestrator');
var vfs = require('vinyl-fs');
var session = require('./lib/session');
var stack = require('./lib/stack');
var init = require('./lib/init');

/**
 * Initialize `Generate`
 *
 * ```js
 * var generate = new Generate();
 * ```
 *
 * @api public
 */

function Generate(opts) {
  this.transforms = this.transforms || {};
  this.session = session;
  Template.call(this, opts);
  Task.call(this, opts);
  init(this);
}

extend(Generate.prototype, Task.prototype);
Template.extend(Generate.prototype);

/**
 * Transforms functions are used to exted the `Generate` object and
 * are run immediately upon init and are used to extend or modify
 * anything on the `this` object.
 *
 * ```js
 * generator.transform('foo', function(generate) {
 *   generate.cache.foo = generate.cache.foo || {};
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
 * generator.run(['foo', 'bar']);
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
 * Glob patterns or filepaths to source files.
 *
 * ```js
 * generator.src('*.js')
 * ```
 *
 * **Example usage**
 *
 * ```js
 * generator.task('web-app', function() {
 *   generate.src('templates/*.tmpl')
 *     generate.dest('project')
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
 * generator.dest('dist', {ext: '.xml'})
 * ```
 *
 * **Example usage**
 *
 * ```js
 * generator.task('sitemap', function() {
 *   generator.src('src/*.txt')
 *     generator.dest('dist', {ext: '.xml'})
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
 * generator.copy('assets/**', 'dist');
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
 * Define a generator.
 *
 * ```js
 * generator.task('docs', function() {
 *   generator.src('*.js').pipe(generator.dest('.'));
 * });
 * ```
 *
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

Generate.prototype.task = Generate.prototype.add;

/**
 * Get the name of the currently running task.
 *
 * ```js
 * generator.gettask();
 * ```
 *
 * @return {String} `task` The currently running task.
 * @api public
 */

Generate.prototype.gettask = function() {
  var name = this.session.get('task');
  return typeof name != 'undefined'
    ? 'generator_' + name
    : 'default';
};

/**
 * Re-run the specified task(s) when a file changes.
 *
 * ```js
 * generator.task('watch', function() {
 *   generator.watch('docs/*.md', ['docs']);
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
