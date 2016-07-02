'use strict';

var path = require('path');
var isValid = require('is-valid-app');
var utils = require('./utils');

module.exports = function(options) {
  return function(app) {
    if (!isValid(app, 'generate-support-middleware')) return;
    app.cache.views = {docs: []};

    app.onLoad(/\.md$/, function(view, next) {
      var related = view.data.related || (view.data.related = {});
      related.doc = utils.arrayify(related.doc);
      related.api = utils.arrayify(related.api);
      related.url = utils.arrayify(related.url);

      if (view.content.indexOf('<!-- toc -->') !== -1) {
        view.data.toc = true;
      }

      view.data.layout = 'default';
      if (view.data.toc === true) {
        view.data.toc = {render: true};
      }
      if (view.stem.indexOf('docs.') === 0) {
        app.cache.views.docs.push(view);
      }
      next();
    });

    app.preRender(/docs[\\\/][^\\\/]+\.md$/, function(view, next) {
      if (typeof view.data.title === 'undefined') {
        next(new Error('`title` is missing in ' + view.path));
        return;
      }
      next();
    });

    app.preWrite(/\.md$/, function(file, next) {
      var segs = file.stem.split('.').filter(Boolean);
      if (segs[0] === 'docs') {
        segs.shift();
        file.stem = segs[0];
      }
      if (segs.length > 1) {
        file.path = path.resolve(file.base, segs.join('/') + file.extname);
      }
      file.content = file.content.trim();
      file.content += '\n';
      next();
    });
  };
};
