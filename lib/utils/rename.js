'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var symbol = require('log-symbols');
var bold = chalk.bold;

for (var key in symbol) {
  if (symbol.hasOwnProperty(key)) {
    symbol[key] = '  ' + symbol[key] + ' ';
  }
}

module.exports = function rename(src, dest, opts) {
  opts = opts || {};

  if (path.resolve(src) === path.resolve(dest)) {
    if (opts.silent !== true) {
      console.log(symbol.warning, bold(src), 'and', bold(dest), 'are the same path.');
    }
  } else if (!fs.existsSync(src)) {
    if (opts.silent !== true) {
      console.log(symbol.error, bold(src), 'does not exist.');
    }
  } else if (fs.existsSync(dest) && opts.force !== true) {
    if (opts.silent !== true) {
      console.log(symbol.warning, bold(dest), 'already exists (to force, pass `true` as the last argument).');
    }
  } else {
    console.log(symbol.success, 'renamed', bold(src), '=>', bold(dest));
    fs.renameSync(src, dest);
  }
};
