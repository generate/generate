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
  generate.transform('generators', init.generators);

  generate.on('loaded', function (argument) {
    generate.transform('store', init.store);
    generate.transform('engines', init.engines);
    generate.transform('loaders', init.loaders);
    generate.transform('create', init.create);
    generate.transform('load', init.load);

    // user environment
    generate.transform('cwd', env.cwd);
    generate.transform('pkg', env.pkg);
    generate.transform('templates', env.templates);
    generate.transform('bower', env.bower);
    generate.transform('appname', env.appname);
    generate.transform('paths', env.paths);
    generate.transform('data', env.data);
  });
};
