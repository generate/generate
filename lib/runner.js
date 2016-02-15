'use strict';

/**
 * Create a "runner" for running locally and globally installed
 * generators. with the given configfile name, and _default_ generator to (optionally) use if one is not supplied by the user. See the [runner docs](docs/runner.md) for more details.
 *
 * @static
 * @param {String} `configfile` The name of the configfile to lookup. Ex: `generator.js`
 * @param {Function} `generatorFn` Optionally pass a function to use for the `default` generator, whenever one is not supplied by the user.
 * @return {Function} Returns a function that takes an instance of `app` and a callback.
 */

module.exports = function(configfile, generatorFn) {
  return function(app, cb) {

    /**
     * Run generators and tasks
     */

    app.runner(configfile, function(err, argv, app) {
      if (err) return cb(err);

      app.on('error', function(err) {
        console.log(err);
        console.log('ENV:', app.env);
        console.log();
        if ('REASON:', err.reason) {
          console.log(err.reason);
        }
        process.exit(1);
      });

      if (!app.hasConfigfile && typeof generatorFn === 'function') {
        app.register('default', generatorFn);
      }

      var config = app.get('cache.config');

      // normalize the config object with `base-config` mappings
      app.config.process(config, function(err) {
        if (err) return cb(err);

        app.cli.process(argv, function(err) {
          if (err) return cb(err);

          cb(null, argv, app);
        });
      });
    });
  };
};
