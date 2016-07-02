'use strict';

var utils = module.exports = require('lazy-cache')(require);
var rules = require('pretty-remarkable/lib/rules');
var fn = require;
require = utils;

require('is-valid-app', 'isValid');
require('has-value');
require('pretty-remarkable', 'prettify');
require('remarkable', 'Remarkable');
require('strip-color');
require('template-helpers', 'helpers');
require('through2', 'through');

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Slugify the url part of a markdown link.
 *
 * @param  {String} `anchor` The string to slugify
 * @return {String}
 * @api public
 */

utils.slugify = function(anchor) {
  anchor = utils.stripColor(anchor);
  anchor = anchor.toLowerCase();
  anchor = anchor.split(/ /).join('-');
  anchor = anchor.split(/\t/).join('--');
  anchor = anchor.split(/[|$&`~=\\\/@+*!?({[\]})<>=.,;:'"^]/).join('');
  return anchor;
};

utils.links = function(rules) {
  var open = rules.link_open;
  rules.link_open = function(tokens, idx, options, env) {
    open.apply(rules, arguments);
    var token = tokens[idx];
    if (options.paths && !/http/.test(token.href)) {
      var href = token.href.replace(/^[.\\\/]+/, '').split(/[\\\/]+/).join('/');
      var paths = options.paths;
      var anchors = paths.anchors;
      var file = options.file;
      if (/#/.test(href)) {
        var idx = href.indexOf('#');
        var val = href.slice(idx + 1);
        var pre = href.slice(0, idx);
        var anc = anchors[pre];
        if (anc && anc.indexOf(val) === -1) {
          throw new Error('cannot find anchor: #' + val + ' in (' + token.href + ') in ' + file.path);
        }
      } else {
        var segs = href.split('/');
        if (segs.length === 1) {
          segs.unshift(file.dir);
        }
        var seg = segs.shift();
        var rest = segs.join('/');
        var group = paths[seg];
        if (typeof group === 'undefined') {
          throw new Error('directory group: ' + seg + ' is not defined');
        }
        if (group.indexOf(rest) === -1 && !/issues/.test(rest)) {
          throw new Error(`cannot find filepath: ${rest} in "${seg}" (${file.path})`);
        }
      }
    }
    return '';
  };
  return rules;
};

utils.lintLinks = function(md) {
  md.renderer.renderInline = function(tokens, options, env) {
    utils.links(rules);
    var _rules = rules;
    var len = tokens.length, i = 0;
    var str = '';

    while (len--) {
      str += _rules[tokens[i].type](tokens, i++, options, env, this);
    }
    return str;
  };

  md.renderer.render = function(tokens, options, env) {
    utils.links(rules);
    var _rules = rules;
    var len = tokens.length, i = -1;
    var str = '';

    while (++i < len) {
      if (tokens[i].type === 'inline') {
        str += this.renderInline(tokens[i].children, options, env);
      } else {
        str += _rules[tokens[i].type](tokens, i, options, env, this);
      }
    }
    return str;
  };
};
