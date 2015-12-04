'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

module.exports = function(app) {
  app.create('templates', {
    renameKey: function(key) {
      return path.basename(key, path.extname(key));
    }
  });

  var templates = app.get('cache.argv.templates');
  if (templates) {
    templates = templates.split(',');
  } else {
    templates = ['templates/**'];
  }

  var cwd = app.get('env.cwd');
  if (!cwd) return;

  var files = utils.globFiles(templates, { cwd: cwd })
    .filter(function(fp) {
      return fs.statSync(fp).isFile();
    });

  files.forEach(function(fp) {
    app.template(fp, {
      content: fs.readFileSync(fp)
    });
  });

  app.emit('loaded', app.docs);
};
