'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function open(app) {
  return function(val) {
    if (val === 'answers') {
      var dest = app.get('questions.dest');
      if (dest) {
        app.log('opening answers data directory >', '"' + dest + '"');
        utils.opn(dest);
        process.exit(0);
      }
    }

    if (val === 'store') {
      var dir = path.dirname(app.get('store.path'));
      if (dir) {
        app.log('opening store data directory >', '"' + dir + '"');
        utils.opn(dir);
        process.exit(0);
      }
    }
  };
};
