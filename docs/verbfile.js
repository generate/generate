'use strict';

var pipeline = require('./support/pipeline');
var helpers = require('./support/helpers');

module.exports = function(app, base) {
  app.helpers(helpers);

  app.task('default', function(cb) {
    return app.src('*.md')
      .pipe(pipeline.md())
      .pipe(app.dest('dist'));
  });
};
