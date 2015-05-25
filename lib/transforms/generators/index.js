'use strict';

var transforms = require('export-files')(__dirname);

module.exports = function(app) {
  app.transform('generators', transforms.generators);
  app.transform('templates', transforms.templates);
};
