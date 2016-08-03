'use strict';

var utils = require('../utils');

module.exports = function(options) {
  return utils.through.obj(function(file, enc, next) {
    file.set('cache.anchors', {});
    var arr = file.cache.anchors[file.relative];
    if (typeof arr === 'undefined') {
      arr = file.cache.anchors[file.relative] = [];
    }

    var matches = file.content.match(/^#+\s+([^\n]+)/gm);
    if (!matches) {
      next(null, file);
      return;
    }

    var len = matches.length;
    var idx = -1;
    var res = [];

    while (++idx < len) {
      var match = matches[idx];

      var anchor = utils.slugify(match.replace(/^#+\s+/, ''));
      if (res.indexOf(anchor) === -1) {
        res.push(anchor);
      }
    }

    res.sort();
    utils.union(arr, res);
    next(null, file);
  });
};

function ecape(file) {
  return file.relative.split('.').join('\\.');
}
