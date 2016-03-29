'use strict';

var verb = require('verb');
var app = verb();

/**
 * Support
 */

var pipeline = require('./support/pipeline');
var helpers = require('./support/helpers');

app.helpers(helpers);

app.task('default', function(cb) {
  return app.src('*.md')
    .pipe(pipeline.md())
    .pipe(app.dest('dist'));
});
