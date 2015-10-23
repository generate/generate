'use strict';

module.exports = function(app, env) {
  app.onLoad(/\.(?:verb(rc)?|readme)\.md$/i, function(view, next) {
    if (view.readme !== false && view.noreadme !== true) {
      view.path = 'README.md';
    }
    next();
  });
};

