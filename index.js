'use strict';

var fs = require('fs');
var path = require('path');
var options = require('./lib/options');
var plugins = require('./lib/plugins');
var utils = require('./lib');
var dest = utils.dest;
var Base = utils.Base;

dest.normalize = function normalize(dir, file, opts, cb) {
  opts = opts || {};
  var cwd = path.resolve(opts.cwd);
  var filepath;
  var destDir;

  if (opts.expand === true) {
    if (typeof dir !== 'string') {
      throw new TypeError('expected dest to be a string with expand=true');
    }

    filepath = dir;
    destDir = path.dirname(filepath);

  } else {
    if (typeof dir === 'function') {
      destDir = dir(file);

    } else if (typeof dir === 'string') {
      destDir = dir;

    } else {
      throw new TypeError('expected dest to be a string or function.');
    }
  }

  var base = opts.base;
  var basePath;

  if (!base) {
    basePath = path.resolve(cwd, destDir);

  } else if (typeof base === 'function') {
    basePath = base(file);

  } else if (typeof base === 'string') {
    basePath = base;

  } else {
    throw new TypeError('expected base to be a string, function or undefined.');
  }

  if (typeof filepath === 'undefined') {
    filepath = path.resolve(basePath, file.relative);
  }

  // update stat properties
  file.stat = (file.stat || new fs.Stats());
  file.stat.mode = opts.mode;
  file.flag = opts.flag;

  // update path properties
  file.cwd = cwd;
  file.base = basePath;
  file.path = filepath;
  cb(null, filepath);
};

/**
 * Initialize `Generate`.
 *
 * @param {Object} `context`
 * @api private
 */

function Generate(opts) {
  if (!(this instanceof Generate)) {
    return new Generate(opts);
  }
  this.options = opts || {};
  Base.call(this);
  this.use(plugins);
  this.use(options);
}

/**
 * Inherit `Base`
 */

Base.extend(Generate);

/**
 * Run a plugin on the `generate` instance. Plugins are run immediately
 * upon initialization, and each time a plugin is run a `use` event
 * is emitted to allow listeners to trigger options or config reloading.
 *
 * ```js
 * var generate = new Generate()
 *   .use(require('foo'))
 *   .use(require('bar'))
 *   .use(require('baz'))
 * ```
 * @param {Function} `fn` plugin function to call
 * @return {Object} Returns the generate instance for chaining.
 * @api public
 */

Generate.prototype.use = function(fn) {
  fn.call(this, this);
  this.emit('use');
  return this;
};

/**
 * Glob patterns or filepaths to source files.
 *
 * ```js
 * app.src('*.js', {});
 * ```
 *
 * @param {String|Array} `glob` Glob patterns or file paths to source files.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
 * @api public
 */

Generate.prototype.src = function(glob, opts) {
  var fn = utils.combine(this, opts && opts.pipeline);
  return utils.loader(this.options, fn)(glob, opts);
};

/**
 * Specify a destination for processed files.
 *
 * ```js
 * generate.dest('foo/', {});
 * ```
 *
 * @param {String|Function} `dest` File path or rename function.
 * @param {Object} `options` Options or locals to pass to `dest` plugins
 * @api public
 */

Generate.prototype.dest = function(dir, opts) {
  return dest(dir, opts);
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

Generate.prototype.copy = function(glob, dest, options) {
  var opts = this.defaults(options);
  return this.src(glob, opts).pipe(this.dest(dest, opts));
};


// Generate.prototype.process = function (config, options, cb) {
//   if (typeof options === 'function') {
//     cb = options;
//     options = {};
//   }
//   options = options || {};
//   var src = loader(options, options.pipeline);
//   src(config.src, {dot: true})
//     .pipe(through.obj(function (file, enc, next) {
//       var dest = config.dest;
//       if (!config.options.expand) {
//         dest = path.join(config.dest, file.relative);
//       }
//       writeFile(dest, file.contents.toString(), next);
//     }))
//     .on('error', cb)
//     .on('end', cb)
//     .on('finish', cb);
// };


/**
 * Similar to [copy](#copy) but call a plugin `pipeline` if passed
 * on the `config` or `options`.
 *
 * @param {Object} `config`
 * @param {Object} `options`
 * @param {Function} `cb`
 * @return {Object}
 */

Generate.prototype.process = function (config, options, cb) {
  if (typeof options === 'function') {
    return this.process(config, this.options, options);
  }
  console.log(arguments)
  var opts = this.defaults(options);
  this.src(config.src, opts)
    .pipe(this.dest(config.dest, opts))
    .on('error', cb)
    .on('end', cb);
  return this;
};

Generate.prototype.files = function (config, options, cb) {
  if (typeof options === 'function') {
    return this.process(config, this.options, options);
  }
  var opts = this.defaults(options);
  this.src(config.src, opts)
    .pipe(this.dest(config.dest, opts))
    .on('error', cb)
    .on('end', cb);
  return this;
};

Generate.prototype.parallel = function (config, cb) {
  utils.async.each(config.files, function (file, next) {
    this.process(file, config, next);
  }.bind(this), cb);
  return this;
};

Generate.prototype.series = function (config, cb) {
  utils.async.eachSeries(config.files, function (file, next) {
    this.process(file, config, next);
  }.bind(this), cb);
  return this;
};

/**
 * Merge default options with user supplied options.
 */

Generate.prototype.defaults = function(options) {
  options = options || {};
  for (var key in this.options) {
    if (!options.hasOwnProperty(key)) {
      options[key] = this.options[key];
    }
  }
  return options;
};

/**
 * Expose our instance of `generate`
 */

module.exports = Generate;
