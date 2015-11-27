'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

module.exports = function(app) {
  app.create('templates', {
    renameKey: function(key) {
      return path.basename(key);
    }
  });

  var glob = app.get('argv.templates');
  if (glob) {
    glob = glob.split(',');
  } else {
    glob = ['templates/**/*.*'];
  }

  var opts = {cwd: app.paths.dirname || ''};

  utils.globFiles(glob, opts).forEach(function(fp) {
    app.template(fp, {content: fs.readFileSync(fp)});
  });

  app.emit('loaded', app.templates);
};
