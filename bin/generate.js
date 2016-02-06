#!/usr/bin/env node

var path = require('path');
var Generate = require('..');
var generate = new Generate();

// temporary
generate.on('error', function(err) {
  console.error(err);
  process.exit(1);
});

// expose generate's metadata on `runner` in templates
generate.base.data('runner', require('../package'));

// set default generator, can be overridden by user
generate.register('fallback', path.resolve(__dirname, '../lib/generators/'));

// run generator and/or tasks
generate.runner('generator.js', function(err, argv, app) {
  if (err) handleError(err);

  var config = app.loadSettings(argv);
  app.set('cache.config', config);
  app.set('cache.argv', argv);

  app.config.process(config, function(err) {
    if (err) handleError(err);

    app.cli.process(argv, function(err) {
      if (err) handleError(err);

      generate.emit('done');
      process.exit(0);
    });
  });
});

// placeholder
function handleError(err) {
  console.log(err);
  process.exit(1);
}
