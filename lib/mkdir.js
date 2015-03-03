'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Make the given directory and intermediates
 * if they don't already exist.
 *
 * @param {String} `destpath`
 * @param {Number} `mode`
 * @return {String}
 * @api private
 */

var mkdirSync = exports.sync = function mkdirSync(dir, mode) {
  mode = mode || parseInt('0777', 8) & (~process.umask());
  if (!fs.existsSync(dir)) {
    var parent = path.dirname(dir);

    if (fs.existsSync(parent)) {
      fs.mkdirSync(dir, mode);
    } else {
      mkdirSync(parent);
      fs.mkdirSync(dir, mode);
    }
  }
};

/**
 * Create the given directory and intermediates
 * if they don't already exist.
 *
 * @param {String} `destpath`
 * @param {Number} `mode`
 * @return {String}
 * @api private
 */

var mkdir = exports.async = function mkdir(dir, cb) {
  var parent = path.dirname(dir);

  fs.exists(parent, function (exists) {
    if (exists) {
      fs.mkdir(dir, cb);
    } else {
      mkdir(parent, function () {
        fs.mkdir(dir, cb);
      });
    }
  });
};
