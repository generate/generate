'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./lib/utils');

module.exports = function(generate, base, env) {
  generate.task('init', function(cb) {
    // todo
    cb();
  });

  generate.task('help', function(cb) {
    // todo
    cb();
  });

  generate.task('templates', function(cb) {
    var opts = { cwd: env.cwd, dot: true };
    if (!base.templates) base.create('templates');

    glob('templates/*', opts, function(err, files) {
      if (err) return cb(err);

      async.map(files, function(name, next) {
        var fp = path.join(env.cwd, name);
        var contents = fs.readFileSync(fp);
        base.template(name, {contents: contents, path: fp});
        next();
      }, cb);
    });
  });

  /**
   * Run the default task
   */

  generate.task('default', ['help']);
};
