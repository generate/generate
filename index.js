/*!
 * generate <https://github.com/jonschlinkert/generate>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var expand = require('expand-args');
var minimist = require('minimist');
var Core = require('assemble-core');
var config = require('./lib/config');
var locals = require('./lib/locals');
var utils = require('./lib/utils');
var cli = require('./lib/cli');

/**
 * Create an instance of `Generate` with the given `options`
 *
 * ```js
 * var Generate = require('generate');
 * var generate = new Generate();
 * ```
 * @param {Object} `options`
 * @api public
 */


function Generate(opts) {
  if (!(this instanceof Generate)) {
    return new Generate(opts);
  }

  Core.call(this, opts);
  config(this);
  cli(this);

  this.define('isGenerate', true);
  this.set('name', 'generate');
  this.set('generators', {});
  this.option({cwd: process.cwd()});

  // parse command line arguments
  var argv = expand(minimist(process.argv.slice(3)));
  var opts = utils.extend({}, this.options, argv);

  this.use(locals('generate'));
  this.use(utils.loader());
  this.use(utils.store());
  this.use(utils.pipeline());
  this.use(utils.ask());

  this.cli.map('process');
  this.cli.process(opts);
}

/**
 * Inherit assemble-core
 */

Core.extend(Generate);

/**
 * Register generator `name` with the given `generate`
 * instance.
 *
 * @param {String} `name`
 * @param {Object} `generate` Instance of generate
 * @return {Object} Returns the instance for chaining
 */

Generate.prototype.generator = function(name, app) {
  if (arguments.length === 1) {
    return this.generators[name];
  }
  app.use(utils.runtimes({
    displayName: function(key) {
      return utils.cyan(name + ':' + key);
    }
  }));
  return (this.generators[name] = app);
};

Generate.prototype.hasGenerater = function(name) {
  return this.generators.hasOwnProperty(name);
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


Generate.prototype.target = function() {

};

Generate.prototype.scaffold = function() {

};

Generate.prototype.boilerplate = function() {

};
/**
 * Expose `Generate`
 */

module.exports = Generate;

/**
 * Expose `utils`
 */

module.exports.utils = utils;
module.exports.meta = require('./package');
module.exports.dir = __dirname;
