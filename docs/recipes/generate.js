'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('matched');

module.exports = function(generate, base, env) {
  generate.task('default', function() {});
  generate.task('readme', function() {});

  generate.task('templates', function(cb) {
    var opts = {cwd: env.cwd, dot: true};
    if (!generate.templates) generate.create('templates');

    glob('templates/*', opts, function(err, files) {
      if (err) return cb(err);

      files.forEach(function(name) {
        var fp = path.join(env.cwd, name);
        generate.template(name, {path: fp, content: fs.readFileSync(fp)});
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
