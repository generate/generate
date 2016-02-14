'use strict';

module.exports = function(app) {
  app.task('foo', function(cb) {
    console.log('generator > foo task');
    cb();
  });
  app.task('default', ['foo']);
};
