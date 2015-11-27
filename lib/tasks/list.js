'use strict';

module.exports = function(app, base, env) {
  return function(cb) {
    base.list(function(err, args) {
      if (err) return cb(err);
      base.build(args.generators, cb);
    });
  };
};
