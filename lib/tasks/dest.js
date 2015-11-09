'use strict';

var utils = require('../utils');

module.exports = function(app, base, env) {
  var plugins = base.get('argv.plugins');

  function handle(stage) {
    return utils.through.obj(function (file, enc, next) {
      if (file.isNull()) return next();
      app.handle(stage, file, next);
    });
  }

  return function (cb) {
    app.toStream('files')
      .on('error', cb)
      .pipe(handle('onStream'))
      .pipe(app.pipeline(plugins))
      .pipe(handle('preWrite'))
      .pipe(app.dest('.'))
      .pipe(utils.exhaust(handle('postWrite')))
      .on('error', cb)
      .on('end', cb);
  };
};

// module.exports = function(app, base, env) {
//   var through = require('through2');
//   var plugins = base.get('argv.plugins');

//   return function (cb) {
//     app.toStream('files')
//       .on('error', cb)
//       .pipe(through.obj(function (file, enc, next) {
//         if (file.isNull()) return next();
//         app.handle('onStream', file, next);
//       }))
//       .pipe(app.pipeline(plugins))
//       .pipe(through.obj(function (file, enc, next) {
//         if (file.isNull()) return next();
//         app.handle('preWrite', file, next);
//       }))
//       .pipe(app.dest('.'))
//       .pipe(through.obj(function (file, enc, next) {
//         if (file.isNull()) return next();
//         app.handle('postWrite', file, next);
//       }))
//       .on('error', cb)
//       .on('end', cb);
//   };
// };
