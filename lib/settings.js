'use strict';

var utils = require('./utils');

/**
 * Create an instance of `Settings`.
 *
 * @class `Settings`
 * @api public
 */

function Settings() {
  this.settings = [];
}

/**
 * Add a setting to merge.
 *
 * ```js
 * setting
 *   .addSettings({a: 'b', c: 'd'})
 *   .addSettings({a: 'z'})
 *   .merge();
 *
 * //=> {a: 'z', c: 'd'}
 * ```
 *
 * @param {Object} `object` The object to merge into the setting
 * @api public
 */

Settings.prototype.addSettings = function (obj) {
  if (Array.isArray(obj) || arguments.length > 1) {
    var args = [].concat.apply([], arguments);
    args.forEach(function (arg) {
      this.settings.push(arg);
    }.bind(this));
  } else {
    this.settings.push(obj);
  }
  return this;
};

/**
 * Calculate the setting, optionally passing a callback `fn` for sorting.
 * _(Note that sorting must be done on levels, not on the setting names)_.
 *
 * ```js
 * app.calculate(['a', 'b'], function(a, b) {
 *   return app.lvl[a] - app.lvl[a];
 * });
 * ```
 *
 * @param {String|Array} `keys` Key, or array of keys for setting levels to include.
 * @param {Function} `fn` Sort function for determining the order of merging.
 * @api public
 */

Settings.prototype.merge = function (obj) {
  if (obj) this.addSettings.apply(this, arguments);
  var setting = {};
  this.settings.forEach(function(ctx) {
    utils.merge(setting, ctx);
  });
  return setting;
};

/**
 * Export `Settings`
 *
 * @type {Object}
 */

module.exports = Settings;
