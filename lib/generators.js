'use strict';

var resolveUp = require('resolve-up');

exports.lookup = function (patterns) {
  // temporary
  resolveUp(patterns || ['node-*']).forEach(function (fp) {
    // this is a placeholder for "tryRegister"
    tryResolve(fp);
  });
};

function tryResolve(fp) {
  // try {
  //   return require.resolve(fp);
  // } catch(err) {}
  return fp;
  // return [];
}
