'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('matched');

module.exports = function(generate, base, env) {
  generate.task('default', function(cb) {
    console.log('base > default');
    cb();
  });

  generate.task('readme', function(cb) {
    console.log('base > readme');
    cb();
  });

  generate.task('templates', function(cb) {
    var opts = { cwd: env.cwd, dot: true };
    if (!base.templates) base.create('templates');

    glob('templates/*', opts, function(err, files) {
      if (err) return cb(err);

      files.forEach(function(name) {
        var fp = path.join(env.cwd, name);
        base.template(name, {
          path: fp,
          content: fs.readFileSync(fp)
        });
      });
      cb();
    });
  });

  generate.register('docs', function(app) {
    app.task('x', function() {});
    app.task('y', function() {});
    app.task('z', function() {});

    app.register('foo', function(app) {
      app.task('x', function() {});
      app.task('y', function() {});
      app.task('z', function() {});
    });
  });
};
