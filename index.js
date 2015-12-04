'use strict';

var async = require('async');
var Base = require('assemble-core');
var middleware = require('common-middleware');
var templates = require('./lib/templates');

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

  Base.apply(this, arguments);
  this.use(middleware());

  this.engine(['md', 'text'], require('engine-base'));
  this.on('register', function(name, app) {
    templates(app);
  });

  this.name = this.options.name || 'base';
  this.isGenerate = true;
  this.generators = {};
}

/**
 * Inherit assemble-core
 */

Base.extend(Generate);

/**
 * Initialize Generate defaults
 */

Generate.prototype.initGenerate = function() {
  // defaults here
};

/**
 * Similar to [copy](#copy) but calls a plugin `pipeline` if passed
 * on the `config` or `options`.
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
  async.eachOf(scaffold, function(target, name, next) {
    this.each(target, next);
  }.bind(this), cb);
};

/**
 * Expose `Generate`
 */

module.exports = Generate;
