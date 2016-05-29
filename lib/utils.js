'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line

/**
 * Utils
 */

require('data-store', 'Store');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('get-value', 'get');
require('is-answer');
require('isobject', 'isObject');
require('mixin-deep', 'merge');
require('resolve-dir');
require = fn; // eslint-disable-line

/**
 * Return true if the generate CLI is enabled
 */

utils.runnerEnabled = function(app) {
  if (app.options.cli === true || process.env.GENERATE_CLI === 'true') {
    return true;
  }
  // if run from the generate cwd (and not using the `gen` command)
  if (process.cwd() === path.resolve(__dirname, '..')) {
    return false;
  }
  // travis or other CI
  if (process.env.CI) {
    return false;
  }
  return true;
};

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
  return function ask(name, message, options, cb) {
    var args = [].slice.call(arguments, 1);
    cb = args.pop();

    if (typeof cb !== 'function') {
      throw new TypeError('expected a callback function');
    }

    var last = args[args.length - 1];
    var opts = {};

    if (utils.isObject(last)) {
      options = args.pop();
    }

    last = args[args.length - 1];
    if (typeof last === 'string') {
      opts.message = args.pop();
    }

    options = utils.merge({}, this.options, opts, options);
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

/**
 * Expose utils
 */

module.exports = utils;
