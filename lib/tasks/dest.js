'use strict';


module.exports = function(app, base, env) {
  var through = require('through2');
  var plugins = base.get('argv.plugins');

  return function (cb) {
    app.toStream('files')
      .on('error', cb)
      .pipe(through.obj(function (file, enc, next) {
        if (file.isNull()) return next();
        app.handle('onStream', file, next);
      }))
      .pipe(app.pipeline(plugins))
      .pipe(through.obj(function (file, enc, next) {
        if (file.isNull()) return next();
        app.handle('preWrite', file, next);
      }))
      .pipe(app.dest('.'))
      .pipe(through.obj(function (file, enc, next) {
        if (file.isNull()) return next();
        app.handle('postWrite', file, next);
      }))
      .on('error', cb)
      .on('end', cb);
  };
};
