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
require('global-modules', 'gm');
require('is-affirmative', 'is');
require('matched', 'glob');
require('mixin-deep', 'merge');
require('resolve-dir');
require = fn; // eslint-disable-line

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
