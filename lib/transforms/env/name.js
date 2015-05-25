'use strict';

var path = require('path');

module.exports = function(app) {
  if (app.exists('project.name')) return;
  var name = app.get('package.name');
  if (!name) {
    name = path.basename(app.cwd || process.cwd());
  }
  app.set('project.name', name);
};
