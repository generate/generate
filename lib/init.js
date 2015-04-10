'use strict';

var transforms = require('./transforms');
var generators = transforms.generators;
var init = transforms.init;
var env = transforms.env;

/**
 * Load initialization transforms:
 *  | runner
 *  | loaders
 *  | create
 *  | options
 *  | middleware
 *  | plugins
 *  | load
 *  | engines
 *  | helpers (load last)
 */

module.exports = function init_(generate) {
  generate.transform('cwd', env.cwd);
  generate.transform('generators', generators);
  generate.transform('runner', init.runner);

  generate.on('loaded', function () {
    generate.transform('project', env.project);
    generate.transform('cwd', env.cwd);
    generate.transform('package', env.pkg);
    generate.transform('bower', env.bower);
    generate.transform('paths', env.paths);
    generate.transform('name', env.name);
    generate.transform('config', env.config);
    generate.emit('env');
  });

  generate.on('env', function () {
    generate.transform('store', init.store);
    generate.transform('templates', init.templates);
    generate.transform('middleware', init.middleware);
    generate.transform('helpers', init.helpers);
    generate.transform('engines', init.engines);
    generate.transform('loaders', init.loaders);
    generate.transform('create', init.create);
    generate.transform('load', init.load);
    generate.emit('init');
  });

  generate.on('init', function () {
    generate.transform('context', env.context);
    generate.emit('last');
  });
};
