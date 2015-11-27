'use strict';

module.exports = function(app, base, env) {
  if (!base.preWrite || !base.onLoad) {
    var err = new Error('json middleware expects onLoad and preWrite handlers');
    err.origin = __filename;
    base.emit('error', err);
    return;
  }

  var jsonRegex = /\.js(on|hintrc)$/;

  base.onLoad(jsonRegex, function(file, next) {
    file.json = JSON.parse(file.content);
    next();
  });

  base.preWrite(jsonRegex, function(file, next) {
    file.content = JSON.stringify(file.json, null, 2);
    next();
  });
};
