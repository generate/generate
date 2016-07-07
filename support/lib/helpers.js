'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function(options) {
  return function(app) {
    if (!utils.isValid(app, 'update-support-helpers')) return;
    app.helpers(utils.helpers());
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

function createLink(dir, prop, link) {
  var key = (prop === 'doc') ? 'docs' : prop;

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
  if (dir !== key) {
    if (key === 'docs') {
      key = '';
    }
    filename = path.join('..', key, filename);
  } else if (key !== 'docs' && dir !== key) {
    filename = path.join(key, filename);
  }
  return `- [${name}](${filename}${anchor})`;
}
