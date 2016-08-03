'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(options) {
  return utils.through.obj(function(file, enc, next) {
    file.html = new utils.Remarkable({file: file})
      .use(lintLinks())
      .use(utils.prettify)
      .render(file.contents.toString());

      // console.log(file.html)
    next(null, file);
  });
};

function lintLinks(options) {
  var rules = require('pretty-remarkable/lib/rules');
  links(rules, options);

  return function(md) {
    md.renderer.renderInline = function(tokens, options, env) {
      var len = tokens.length, idx = -1;
      var str = '';

      while (++idx < len) {
        str += rules[tokens[idx].type](tokens, idx, options, env, this);
      }
      return str;
    };

    md.renderer.render = function(tokens, options, env) {
      var len = tokens.length, idx = -1;
      var str = '';

      while (++idx < len) {
        if (tokens[idx].type === 'inline') {
          str += this.renderInline(tokens[idx].children, options, env);
        } else {
          str += rules[tokens[idx].type](tokens, idx, options, env, this);
        }
      }
      return str;
    };
  };
};

function getDir(fp) {
  var path = fp;
  var segs = fp.split('/');
  var base = 'docs';
  if (segs.length > 1) {
    base = segs.shift();
    path = segs.join('/');
  }
  if (base === 'doc') {
    base = 'docs';
  }
  return {path, base};
}

function links(rules) {
  if (rules._added) return;
  rules._added = true;

  var open = rules.link_open;
  rules.link_open = function(tokens, idx, options, env) {
    var token = tokens[idx];
    if (/[.\\\/]+issues/.test(token.href)) {
      return;
    }

    var file = options.file;
    var cache = file.cache || {};
    var anchors = cache.anchors;
    var paths = cache.paths;
    if (cache && !/http/.test(token.href)) {
      var href = token.href.replace(/^\.\//, '');

      if (/#/.test(href)) {
        var i = href.indexOf('#');
        var val = href.slice(i + 1);
        var pre = href.slice(0, i);
        var anchor = anchors[pre];

        if (anchor && anchor.indexOf(val) === -1) {
          throw new Error(`cannot find anchor: #${val} in "${pre}" (defined in ${file.relative})`);
        }
      } else {
        var obj = getDir(href);
        var group = paths[obj.base];
        if (file.dir !== obj.base) {
          var prefix = '../';
          if (token.href.indexOf(obj.base) === -1) {
            prefix += obj.base;
          }
          token.href = path.join(prefix, token.href);
        }

        if (file.dir === obj.base && token.href.indexOf(file.dir) === 0) {
          token.href = path.relative(obj.base, token.href);
        }

        // if (typeof group === 'undefined') {
        //   throw new Error(`directory group: "${obj.base}" is not defined`);
        // }

        // var j = group.indexOf(obj.path);
        // if (j === -1) {
        //   group = paths[file.dir];
        //   j = group.indexOf(obj.path);
        // }

        // if (j === -1) {
        //   throw new Error(`cannot find filepath: "${obj.path}" in "${obj.base}" (${file.relative})`);
        // }
      }
    }

    open.apply(rules, arguments);
    rules.link_open = open;
    return '';
  };
  return rules;
};
