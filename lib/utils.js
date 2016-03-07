'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line

/**
 * Utils
 */

require('data-store', 'Store');
require('extend-shallow', 'extend');
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
  var plugin = app.plugin;

  app.mixin('plugin', function(name) {
    var pipeline = app.options.pipeline || [];
    if (arguments.length === 1 && pipeline.length) {
      var idx = pipeline.indexOf(name);
      if (idx !== -1) {
        pipeline.splice(idx, 1);
      }
    } else if (!~pipeline.indexOf(name)) {
      pipeline.push(name);
    }
    plugin.apply(app, arguments);
    return app;
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
  return function ask(name, question, cb) {
    if (typeof question === 'function') {
      return ask.call(this, name, {}, question);
    }

    this.app.ask(name, question, function(err, answers) {
      if (err) return cb(err);
      cb(null, answers[name]);
    });
  };
};

/**
 * Expose utils
 */

module.exports = utils;
