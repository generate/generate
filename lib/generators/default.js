'use strict';

var debug = require('debug')('verb:generator');

module.exports = function(app) {
  app.register('verbfile', require('./templates/verbfile'));

  app.task('default', function(cb) {
    app.generate('verbfile', cb);
  });
};
