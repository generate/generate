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
  return function ask(name, message, options, cb) {
    if (typeof message === 'function') {
      return ask.call(this, name, null, {}, message);
    }

    if (typeof options === 'function') {
      return ask.call(this, name, message, {}, options);
    }

    if (typeof options === 'string') {
      options = { message: options };
    }

    options = utils.merge({message: message}, this.options, options);
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
