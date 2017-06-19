'use strict';

var koalas = require('koalas');

/**
 * "Coalesce" helper. Returns the first non-undefined,
 * non-null value.
 *
 * ```js
 * {{or a b c}}
 * ```
 */

module.exports = function or() {
  // remove handlebars options from args
  var args = [].slice.call(arguments, 0, -1);
  return koalas.apply(null, args);
};
