'use strict';

module.exports = function(app, base, env) {
 var regex = /\.(json|jshintrc)$/;

  base.onLoad(regex, function(file, next) {
    file.json = JSON.parse(file.content);
    next();
  });

  base.preWrite(regex, function(file, next) {
    file.content = JSON.stringify(file.json, null, 2);
    next();
  });
};
