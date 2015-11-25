'use strict';

var path = require('path');
var utils = require('../../utils');

module.exports = function(app, base) {
  app.create('templates', {
    renameKey: function (key) {
      return path.basename(key);
    }
  });

  var glob = app.get('argv.templates');
  if (glob) {
    glob = glob.split(',');
  } else {
    glob = ['templates/**'];
  }

  app.task('templates', function(cb) {
    var opts = {dot: true, ignore: ['.DS_Store']};
    opts.cwd = app.paths.dirname || '';
    app.templates(glob, opts);
    app.emit('loaded', app.templates);
    cb();
  });
};
