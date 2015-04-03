'use strict';

var init = require('./transforms');
var env = init.env;

/**
 * Load initialization transforms
 */

module.exports = function init_(generate) {
  generate.transform('sessson', init.sessson);
  generate.transform('store', init.store);
  generate.transform('paths', env.paths);
  generate.transform('data', env.data);
  generate.transform('generators', init.generators);
  generate.transform('appname', env.appname);
};
