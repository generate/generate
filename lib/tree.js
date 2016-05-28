'use strict';

var path = require('path');
var archy = require('archy');
var colors = require('ansi-colors');
var regex = /^(base|assemble|generate|templates)-/;
var core = /^(base|(assemble|generate|templates)(-.*?)?)$/;

/**
 * Render a dependency tree with unicode pipes using
 * [archy](https://github.com/substack/node-archy)
 *
 * ```js
 * var tree = toTree({
 *   depth: 3,
 *   stylize: stylize,
 *   filter: function(key) {
 *     return regex.test(key);
 *   }
 * });
 * console.log(tree);
 * ```
 */

function toTree(options) {
  options = options || {};
  var cwd = options.cwd || process.cwd();
  var stylize = options.stylize || identity;

  function buildTree(dir, child) {
    child = child || dir;

    var pkgPath = path.resolve(dir, 'package.json');
    var pkg = require(pkgPath);
    var name = pkg.name;
    var keys = Object.keys(pkg.dependencies || {});
    var tree = {label: stylize(name, pkg), nodes: []};
    var deps = keys.filter(function(key) {
      return filter(options)(key, pkg);
    });

    var len = deps.length;
    var idx = -1;
    while (++idx < len) {
      tree.nodes.push(buildTree(path.resolve(child, 'node_modules', deps[idx]), child));
    }
    return tree;
  }

  return archy(buildTree(cwd));
}

/**
 * Filter keys
 */

function filter(options) {
  if (typeof options.filter === 'undefined') {
    return identity;
  }
  if (typeof options.filter === 'function') {
    return options.filter;
  }
  if (typeof options.filter === 'string') {
    options.filter = new RegExp(options.filter);
  }
  if (options.filter instanceof RegExp) {
    return function(key) {
      return options.filter.test(key);
    };
  }
  return identity;
}

/**
 * Stylize keys
 */

function stylize(name, options) {
  if (options.nocolor === true || options.color === false || options.markdown === true) {
    return name;
  }

  if (name === 'generate') {
    return colors.bold(name);
  }

  var match = /(assemble|base|generate|templates)/.exec(name);
  switch (match && match[1]) {
    case 'base':
      name = colors.red(name);
      break;
    case 'assemble':
      name = colors.cyan(name);
      break;
    case 'generate':
      name = colors.green(name);
      break;
    case 'templates':
      name = colors.yellow(name);
      break;
    case null:
    default: {
      break;
    }
  }
  return name;
}

/**
 * Return `val`
 */

function identity(val) {
  return val;
}

/**
 * Expose `toTree`
 */

module.exports = toTree;

var tree = toTree({
  stylize: stylize,
  filter: function(key, pkg) {
    if (/-handle/.test(key)) {
      return false;
    }
    if (core.test(pkg.name) && regex.test(key)) {
      return true;
    }
    return core.test(key);
  }
});
console.log(tree);
