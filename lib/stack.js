'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var sessionify = require('sessionify');
var filter = require('gulp-filter');
var vfs = require('vinyl-fs');
var es = require('event-stream');
var _ = require('lodash');

/**
 * Local dependencies
 */

var plugins = require('./plugins');
var session = require('./session');

/**
 * Create a plugin stack to be run by `src` or `dest`
 */

function createStack(generate, plugins) {
  var stack = [];
  plugins.forEach(function (plugin) {
    if (plugin == null) {
      stack.push(through.obj());
    } else {
      stack.push(plugin);
    }
  });
  var res = es.pipe.apply(es, stack);
  return sessionify(res, session);
}

/**
 * Default `src` plugins to run.
 */

exports.src = function (generate, glob, opts) {
  opts = _.extend({}, this.options, opts);
  session.set('src-opts', opts);
  return createStack(generate, [
    vfs.src(glob, opts),
    plugins.init.call(generate, opts)
  ]);
};

/**
 * Default `src` plugins to run.
 */

exports.templates = function (generate, glob, opts) {
  opts = _.extend({}, this.options, opts);
  session.set('src-opts', opts);
  return createStack(generate, [
    vfs.src(glob, opts),
    plugins.init.call(generate, opts)
  ]);
};

/**
 * Default `dest` plugins to run.
 */

exports.dest = function (generate, dest, options) {
  var srcOpts = session.get('src-opts') || {};
  var opts = _.extend({}, this.options, srcOpts, options);
  var locals = opts.locals;

  return createStack(generate, [
    plugins.dest.call(generate, dest, opts),
    plugins.render.call(generate, opts, locals),
    vfs.dest(dest, opts)
  ]);
};
