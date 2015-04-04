'use strict';

var init = require('export-files')(__dirname);
var env = require('../env');

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

module.exports = function init_(verb) {
  verb.transform('cwd', init.cwd);
  verb.transform('env', env.env);
  verb.transform('pkg', init.pkg);

  verb.transform('loaders', init.loaders);
  verb.transform('create', init.create);
  verb.transform('load', init.load);

  verb.transform('options', init.options);
  verb.transform('middleware', init.middleware);
  verb.transform('plugins', init.plugins);
  verb.transform('engines', init.engines);
  verb.transform('helpers', init.helpers);
};
