'use strict';

var transforms = require('./transforms');
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
  generate.transform('generators', init.generators);

  generate.on('loaded', function () {
    generate.transform('pkg', env.pkg);
    generate.transform('bower', env.bower);
    generate.transform('paths', env.paths);
    generate.transform('appname', env.appname);
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
    generate.transform('data', env.data);
    generate.emit('last');
  });
};
