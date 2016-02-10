'use strict';

module.exports = function(app) {
  app.task('default', function(cb) {
    console.log('no tasks or generators specified, skipping.');
    cb();
  });
};
