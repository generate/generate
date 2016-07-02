'use strict';

var path = require('path');
var generators = require('base-generators');
var paths = require('./lib/paths');
var lib = require('./lib');

module.exports = function(app) {
  var dest = paths.site();
  app.use(generators());
  app.use(lib.common());
  app.register('verb', require('./verbfile'));

  app.task('verb', function(cb) {
    app.generate('verb', cb);
  });

  app.task('default', ['verb'], function() {
    app.layouts(paths.tmpl('layouts/*.hbs'));
    app.includes(paths.tmpl('includes/*.hbs'));
    app.pages(paths.docs('**/*.md'));
    return app.toStream('pages')
      .pipe(lib.plugins.buildPaths(dest))
      .pipe(lib.plugins.lintPaths(dest))
      .pipe(app.renderFile())
      .pipe(app.dest(dest));
  });
};
