#!/usr/bin/env node

process.env.GENERATE_CLI = true;
var Generate = require('..');
var generate = new Generate();

// expose generate's metadata on `runner` in templates
generate.base.data('runner', require('../package'));

// run generator and/or tasks
generate.runner('generator.js', function(err, argv, app) {
  if (err) handleError(err);

  if (!app.hasConfigfile) {
    app.register('default', require('../lib/generators/'));
  }

  app.on('error', function(err) {
    console.log(app.env);
    console.log();

    if (err.reason) {
      console.log(err.reason);
      process.exit(1);
    }
  });

  var config = app.get('cache.config');

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
