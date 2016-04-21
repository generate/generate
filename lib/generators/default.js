'use strict';

module.exports = function(app) {
  app.task('help', function(cb) {
    app.cli.process({ help: true }, cb);
  });
  app.task('default', ['help']);
};
