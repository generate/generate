'use strict';

module.exports = function (app) {
  app.task('jshint', require('./lib/tasks/jshint'));
};
