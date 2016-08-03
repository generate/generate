'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function(options) {
  return function(app) {
    if (!utils.isValid(app, 'update-support-helpers')) return;
    app.helpers(utils.helpers());
    app.helper('raw', function(str) {
      return str;
    });

    app.helper('hasValue', function(val, str) {
      return utils.hasValue(val) ? str : '';
    });

    app.helper('hasAny', function(arr, str) {
      arr = utils.arrayify(arr);
      var len = arr.length;
      var idx = -1;
      while (++idx < len) {
        var ele = arr[idx] || [];
        if (ele.length) {
          return str;
        }
      }
      return '';
    });

    app.helper('relatedLinks', function(related) {
      if (!related || typeof related !== 'object') {
        return '';
      }
      var links = app.getHelper('links').bind(this);
      return relatedLinks(related, links);
    });

    app.helper('links', function(related, prop) {
      var arr = related[prop] || (related[prop] = []);
      arr = utils.arrayify(arr);
      if (arr.length === 0) {
        return '';
      }

      var fp = this.view.stem;
      var dir = 'docs';
      var segs = fp.split('.');
      if (segs.length > 1) {
        dir = segs[0];
      }
      var links = arr.map(function(link) {
        return createLink(dir, prop, link);
      });
      return links.join('\n');
    });
  };
};

function relatedLinks(related, links) {
  var keys = Object.keys(related);
  if (keys.length === 0) {
    return '';
  }

  var hasLinks = false;
  function reduce(acc, key) {
    if (related[key].length === 0) {
      return acc;
    }

    hasLinks = true;
    acc += `**${heading(key)}**\n${links(related, key)}\n`;
    return acc;
  }

  var list = `${keys.reduce(reduce, '')}`;

  if (!hasLinks) {
    return '';
  }

  return `## Related\n${list}`;
}

function createLink(dir, prop, link) {
  var key = (prop === 'doc') ? 'docs' : prop;
  link = normalizeLink(link);

  if (dir !== key) {
    if (key === 'docs') {
      key = '';
    }
    link.filename = path.join('..', key, link.filename);
  } else if (key !== 'docs' && dir !== key) {
    link.filename = path.join(key, link.filename);
  }
  return `- [${link.title}](${link.filename}${link.anchor})`;
}

function heading(title) {
  switch (title.toLowerCase()) {
    case 'doc':
      title = 'docs';
      break;
    case 'url':
      title = 'links';
      break;
    default:
      if (/(i|s)$/.test(title.toLowerCase()) === false) {
        title += 's';
      }
      break;
  }

  if (/s$/.test(title)) {
    return utils.pascalcase(title);
  }
  return title.toUpperCase();
}

function normalizeLink(obj) {
  if (typeof obj === 'string') {
    obj = {link: obj};
  }
  var link = obj.link;
  var filename = link;
  var name = link;
  var anchor = '';
  var segs = link.split('#');
  if (segs.length === 2) {
    name = segs[segs.length - 1];
    anchor = '#' + name;
    filename = segs[0];
  }

  if (!/\.md$/.test(filename) && !/#/.test(filename)) {
    filename += '.md';
  }

  obj.title = obj.title || name;
  obj.filename = obj.filename || filename;
  obj.anchor = obj.anchor || anchor;
  return obj;
}
