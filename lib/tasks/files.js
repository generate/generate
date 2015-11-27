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

  var glob = base.get('argv.files')
    ? glob.split(',')
    : ['*', 'lib/*', 'bin/*'];

  return function(cb) {
    utils.globFiles(glob).forEach(function(fp) {
      base.file(fp, {content: fs.readFileSync(fp)});
    });

    base.emit('loaded', base.files);
    cb();
  };
};
