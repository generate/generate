'use strict';


module.exports = function (app) {
  // if (!app.isGenerate) return;

  var config = require('base-config');
  app.use(config());

  app.config
    .map('addViews')
    .map('addView')
    .map('helpers')
    .map('asyncHelpers')
    .map('plugins', function(val) {
      app.visit('plugin', val);
    })
    .map('data', function(val) {
      app.visit('data', val);
    })
    .map('collections', function(val) {
      app.visit('create', val);
    })
    .map('cwd', function (fp) {
      console.log(fp)
      app.option('cwd', fp);
    })
};
