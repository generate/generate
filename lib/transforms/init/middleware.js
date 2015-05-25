'use strict';

var chalk = require('chalk');
var mu = require('middleware-utils');
var tu = require('template-utils').utils;
var middleware = require('../../middleware');
var err = mu.error,
  regex;

/**
 * Initialize default middleware
 */

module.exports = function (app) {
  // use extensions from engines to create route regex
  if (typeof regex === 'undefined') {
    regex = tu.extensionRe(Object.keys(app.engines));
  }

  app.onLoad(regex, middleware.matter)
    .onLoad(/./, mu.series([
      middleware.dotfiles(app),
      middleware.props,
      middleware.src,
      middleware.ext
    ]), debugFile('onLoad'))
    .preCompile(/./, mu.parallel([
      middleware.dotfiles(app),
      middleware.engine(app),
    ]), debugFile('onLoad'))
    .preRender(/./, mu.parallel([
      middleware.dotfiles(app),
      middleware.engine(app),
    ]), debugFile('onLoad'));
};

function debugFile(method) {
  return function (err, file, next) {
    if (!err) return next();
    console.log(chalk.yellow('//', method + ' ----------------'));
    console.log(chalk.bold('file.path:'), file.path);
    console.log(chalk.cyan('file.data:'), file.data);
    console.log(chalk.gray('file.opts:'), file.options);
    console.log(chalk.yellow('// end -----------------------'));
    console.log();
    next();
  };
}
