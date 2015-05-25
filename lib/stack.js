'use strict';

var path = require('path');
var lookup = require('look-up');
var through = require('through2');
var sessionify = require('sessionify');
var render = require('template-render');
var paths = require('gulp-dest-paths');
var init = require('template-init');
var es = require('event-stream');
var vfs = require('vinyl-fs');
var _ = require('lodash');

/**
 * Local dependencies
 */

var plugins = require('./plugins');
var session = require('./session');

/**
 * Default `src` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * app.disable('src:foo plugin');
 * ```
 */

exports.src = function (app, glob, opts) {
  opts = _.extend({}, app.options, opts);
  opts.cwd = app.get('generator.cwd');
  session.set('src', opts);

  return createStack(app, [
    vfs.src(glob, opts),
    init(app)(opts)
  ]);
};

/**
 * Default `template` plugins to run.
 */

exports.templates = function (app, glob, opts) {
  opts = _.extend({}, app.options, opts);
  opts.cwd = app.get('generator.templates');
  session.set('templates', opts);

  return createStack(app, [
    exports.src(app, glob, opts),
    init(app)(opts)
  ]);
};

/**
 * Default `dest` plugins to run.
 *
 * To disable a plugin:
 *
 * ```js
 * app.disable('dest:bar plugin');
 * ```
 */

exports.dest = function (app, dest, options) {
  var srcOpts = session.get('src') || session.get('templates') || {};
  var opts = _.extend({}, app.options, srcOpts, options);
  dest = path.resolve(process.cwd(), dest);

  return createStack(app, [
    paths(dest, opts),
    plugins.render(app)(opts.locals, opts),
    vfs.dest(dest, opts)
  ]);
};

/**
 * Create the default plugin stack based on user settings.
 *
 * Disable a plugin by passing the name of the plugin + ` plugin`
 * to `app.disable()`,
 *
 * **Example:**
 *
 * ```js
 * app.disable('src:foo plugin');
 * app.disable('src:bar plugin');
 * ```
 */

function createStack(app, plugins) {
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
