'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('../utils');

module.exports = function(app, base) {
  base.create('files', {
    renameKey: function(key) {
      return path.basename(key);
    }
  });

  var glob = base.get('argv.files');
  if (glob) {
    glob = glob.split(',');
  } else {
    glob = ['*', 'lib/*', 'bin/*'];
  }

  return function(cb) {
    utils.globFiles(glob).forEach(function(fp) {
      if (fs.statSync(fp).isFile()) {
        base.file(fp, {content: fs.readFileSync(fp)});
      }
    });

    base.emit('loaded', base.files);
    cb();
  };
};
