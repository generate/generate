'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line

/**
 * Utils
 */

require('data-store', 'Store');
require('extend-shallow', 'extend');
require('get-value', 'get');
require('fs-exists-sync', 'exists');
require('is-answer');
require('mixin-deep', 'merge');
require('resolve-dir');
require = fn; // eslint-disable-line

/**
 * Async helper that prompts the user and populates a template
 * with the answer.
 *
 * ```html
 * <%%= ask('author.name') %>
 * ```
 * @param {Object} `app`
 * @return {Function} Returns the helper function
 * @api public
 */

utils.ask = function(app) {
  return function ask(name, options, cb) {
    if (typeof options === 'function') {
      return ask.call(this, name, {}, options);
    }

    options = utils.merge({}, this.options, options);
    var ctx = this.context;
    var val = ctx.get(name);

    var isAnswered = utils.isAnswer(val);
    options.force = !isAnswered;
    options.save = false;

    // conditionally prompt the user
    switch (options.askWhen) {
      case 'never':
        cb(null, val);
        return;

      case 'not-answered':
        if (isAnswered) {
          cb(null, val);
          return;
        }
        break;

      case 'always':
      default: {
        break;
      }
    }

    this.app.ask(name, options, function(err, answers) {
      if (err) return cb(err);
      app.data(answers);
      cb(null, utils.get(answers, name));
    });
  };
};

utils.dest = function(options) {
  return function(app) {
    var dest = this.dest;
    this.define('dest', function(dir, options) {
      var opts = utils.extend({ cwd: this.cwd }, options);
      if (typeof dir !== 'function' && typeof this.rename === 'function') {
        dir = this.rename(dir);
      }
      return dest.call(this, dir, opts);
    });
  };
};

utils.src = function(collection) {
  return function(app) {
    collection = collection || 'templates';
    var src = this.src;

    this.define('src', function(patterns, options) {
      var opts = utils.extend({ renameKey: utils.renameKey }, options);
      if (typeof opts.collection === 'undefined') {
        opts.collection = collection;
      }
      if (typeof opts.cwd === 'undefined') {
        opts.cwd = (this.env && this.env.cwd) || this.cwd;
      }
      return src.call(this, patterns, opts);
    });
  };
};

utils.create = function(options) {
  return function customCreate(app) {
    if (this.isRegistered('custom-app-create')) return;
    if (!this.isTemplates) return;
    var create = this.create;

    this.define('create', function(name, options) {
      var config = { engine: '*', renameKey: utils.renameKey, cwd: cwd };
      var createOpts = this.option(['create', name]);
      var opts = utils.extend({}, config, createOpts, options);
      var cwd = opts.cwd ? path.resolve(opts.cwd) : this.cwd;
      if (utils.exists(path.resolve(cwd, 'templates'))) {
        cwd = path.resolve(this.cwd, 'templates');
      }

      var collection = this[name];
      if (typeof collection === 'undefined') {
        collection = create.call(this, name, opts);
      } else {
        collection.option(opts);
      }
      return collection;
    });

    return customCreate;
  };
};

/**
 * Create a view collection if it doesn't already exist.
 * If the collection exists, update the options with
 * the given options.
 */

utils.lazyCreate = function(app) {
  return function(name, opts) {
    if (!app[name]) {
      app.create(name, opts);
    } else {
      app[name].option(opts);
    }
    return app[name];
  };
};

/**
 * Augment the `plugin` method to add plugins to the pipline
 * automatically.
 */

utils.plugin = function(options) {
  return function(app) {
    this.options.pipeline = this.options.pipeline || [];
    var plugin = this.plugin;

    this.define('plugin', function(name) {
      var idx = this.options.pipeline.indexOf(name);
      if (idx !== -1) {
        this.options.pipeline.splice(idx, 1);
      }
      if (this.options.pipeline.indexOf(name) === -1) {
        this.options.pipeline.push(name);
      }
      plugin.apply(this, arguments);
      return this;
    });
  };
};

/**
 * Expose utils
 */

module.exports = utils;
