'use strict';

module.exports = function(app, prop) {
  return app.pkg.get(prop) || {};
};
