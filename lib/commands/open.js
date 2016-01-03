'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function open(app) {
  return function(val) {
    if (val === 'answers') {
      var dest = app.get('questions.dest');
      if (dest) {
        console.log('opening answers data directory >', '"' + dest + '"');
        utils.opn(dest);
      }
    }

    if (val === 'store') {
      var dir = path.dirname(app.get('store.path'));
      if (dir) {
        console.log('opening store data directory >', '"' + dir + '"');
        utils.opn(dir);
      }
    }
  };
};
