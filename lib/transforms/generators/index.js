'use strict';

var transforms = require('export-files')(__dirname);

module.exports = function generators_(generate) {
  this.transform('generators', transforms.generators);
};
