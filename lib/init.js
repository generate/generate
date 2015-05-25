'use strict';

var transforms = require('./transforms');
var generators = transforms.generators;
var init = transforms.init;
var env = transforms.env;

/**
 * Load initialization transforms
 *
 *  | config
 *  | loaders
 *  | templates
 *  | options
 *  | middleware
 *  | plugins
 *  | load
 *  | engines
 *  | helpers
 */

module.exports = function(app) {
  app.transform('cwd', env.cwd);
  app.transform('generators', generators);
  app.transform('runner', init.runner);
  app.transform('metadata', init.metadata);

  app.once('loaded', function () {
    app.transform('project', env.project);
    app.transform('cwd', env.cwd);
    app.transform('package', env.pkg);
    app.transform('paths', env.paths);
    app.transform('name', env.name);
    app.emit('env');
  });

  app.once('env', function () {
    app.transform('options', init.options);
    app.transform('runner', init.runner);
    app.transform('argv', init.argv);
    app.transform('config', init.config);
    app.transform('loaders', init.loaders);
    app.transform('create', init.create);
    app.transform('engines', init.engines);
    app.transform('middleware', init.middleware);
    app.transform('helpers', init.helpers);
    app.transform('load', init.load);
    app.transform('plugins', init.plugins);
    app.emit('init');
  });

  app.once('init', function () {
    app.transform('helpers', init.helpers);
    app.transform('context', env.context);
    app.emit('last');
  });
};
