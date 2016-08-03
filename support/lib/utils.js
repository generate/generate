'use strict';

var utils = module.exports = require('lazy-cache')(require);
var fn = require;
require = utils;

require('arr-union', 'union');
require('has-value');
require('is-valid-app', 'isValid');
require('pascalcase');
require('pretty-remarkable', 'prettify');
require('remarkable', 'Remarkable');
require('strip-color');
require('template-helpers', 'helpers');
require('through2', 'through');
require = fn;

/**
 * Cast `val` to an array
 *
 * @param {any} val
 * @return {Array}
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Slugify the url part of a markdown link.
 *
 * @param  {String} `anchor` The string to slugify
 * @return {String}
 */

utils.slugify = function(anchor) {
  anchor = utils.stripColor(anchor);
  anchor = anchor.toLowerCase();
  anchor = anchor.split(/ /).join('-');
  anchor = anchor.split(/\t/).join('--');
  anchor = anchor.split(/[|$&`~=\\\/@+*!?({[\]})<>=.,;:'"^]/).join('');
  return anchor;
};
