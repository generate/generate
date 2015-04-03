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
  Template.call(this, opts);
  Task.call(this, opts);
  this.transforms = {};
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
 * generate.transform('foo', function(generate) {
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
  this.transforms[name] = fn;
  if (fn && typeof fn === 'function') {
    fn.call(this, this);
  }
  return this;
};

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
 * generate.dest('dist', {ext: '.xml'})
 * ```
 *
 * **Example usage**
 *
 * ```js
 * generate.task('sitemap', function() {
 *   generate.src('src/*.txt')
 *     generate.dest('dist', {ext: '.xml'})
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
 * generate.copy('assets/**', 'dist');
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
 * generate.task('docs', function() {
 *   generate.src('*.js').pipe(generate.dest('.'));
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
 * generate.gettask();
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

  if (!Array.isArray(fn)) vfs.watch(glob, opts, fn);
  return vfs.watch(glob, opts, function () {
    this.start.apply(this, fn);
  }.bind(this));
};

/**
 * Expose `generate.Generate`
 */

Generate.prototype.Generate = Generate;

/**
 * Expose `generate`
 */

module.exports = new Generate();
