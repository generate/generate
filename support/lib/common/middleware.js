'use strict';

var path = require('path');
var isValid = require('is-valid-app');
var utils = require('../utils');

module.exports = function(options) {
  return function(app) {
    if (!isValid(app, 'generate-support-middleware')) return;

    app.onLoad(/\.md$/, function(file, next) {
      if (file.isLinted) {
        next(null, file);
        return;
      }

      file.isLinted = true;
      if (!file.isRenderable) {
        next(null, file);
        return;
      }

      if (typeof file.data.title === 'undefined') {
        next(new Error('`title` is missing in ' + file.relative));
        return;
      }

      var related = file.data.related || (file.data.related = {});
      related.doc = utils.arrayify(related.doc || related.docs);
      related.api = utils.arrayify(related.api);
      related.cli = utils.arrayify(related.cli);
      related.url = utils.arrayify(related.url);

      if (file.content.indexOf('<!-- toc -->') !== -1) {
        file.data.toc = true;
      }

      file.data.layout = 'default';
      if (file.data.toc === true) {
        file.data.toc = {render: true};
      }
      next();
    });

    app.preLayout(/\.md$/, function(file, next) {
      file.layout = 'docs';
      next();
    });

    app.onLoad(/\.md$/, function(file, next) {
      file.dir = '';
      var segs = file.stem.split('.').filter(Boolean);
      if (segs[0] === 'docs') {
        segs.shift();
      }
      if (segs.length > 1) {
        file.dir = segs[0];
        file.path = path.resolve(file.base, segs.join('/') + file.extname);
      }
      file.content = file.content.trim();
      file.content += '\n';
      next();
    });
  };
};
