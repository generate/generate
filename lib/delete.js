'use strict';

var fs = require('fs');
var chalk = require('chalk');
var symbol = require('log-symbols');
var del = require('delete');
var bold = chalk.bold;

module.exports = function _delete(fp, opts) {
  if (!fs.existsSync(fp)) {
    if (opts && opts.silent !== true) {
      console.log(symbol.error, bold(src), 'does not exist.');
    }
  } else {
    del.sync(fp, opts && opts.force);
    console.log(symbol.success, 'deleted', bold(fp));
  }
};
