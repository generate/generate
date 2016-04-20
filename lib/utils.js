'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line

/**
 * Utils
 */

require('data-store', 'Store');
require('extend-shallow', 'extend');
require('get-value', 'get');
require('is-answer');
require('resolve-dir');
require = fn; // eslint-disable-line

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

utils.plugin = function(app) {
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

/**
 * Async helper that ask a question once and populates a template
 * with the answer.
 *
 * ```html
 * <%%= ask('name') %>
 * ```
 */

utils.ask = function(app) {
  return function ask(name, options, cb) {
    if (typeof options === 'function') {
      return ask.call(this, name, {}, options);
    }

    options = options || {};
    var ctx = this.context;
    var val = ctx.get(name);

    options.save = false;
    if (!utils.isAnswer(val)) {
      options.force = true;
    }

    this.app.ask(name, options, function(err, answers) {
      if (err) return cb(err);
      app.data(answers);
      cb(null, utils.get(answers, name));
    });
  };
};

/**
 * Expose utils
 */

module.exports = utils;
