'use strict';

var path = require('path');
var generators = require('base-generators');
var common = require('./lib/common');
var build = require('./lib/build');
var utils = require('./lib/utils');

module.exports = function(app) {
  var paths = build.paths;
  var dest = paths.site();
  var md = new utils.Remarkable();

  app.use(require('./verbfile'));
  app.use(common());

  app.on('error', console.log);

  app.task('default', ['docs'], function() {
    app.layouts(paths.tmpl('layouts/*.hbs'));
    app.includes(paths.tmpl('includes/*.hbs'));

    return app.toStream('docs')
      .pipe(app.renderFile({layout: 'default'}))
      .pipe(utils.through.obj(function(file, enc, next) {
        file.content = md.render(file.content);
        next(null, file);
      }))
      .pipe(app.dest(function(file) {
        file.extname = '.html';
        return dest;
      }));
  });
};
