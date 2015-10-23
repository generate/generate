'use strict';

var utils = require('../utils');

module.exports = function(app, env) {
  return function (cb) {
    env.list(function (err, args) {
      if (err) return cb(err);
      env.run(args, cb);
    });
  };
};
