'use strict';

var utils = require('./utils');

/**
 * Expose `Generator`
 */

module.exports = function Generator(name, app, env, generate) {
  function createInstance(app, fn) {
    var base = generate.base;
    app.name = name;
    app.env = env || base.env;
    app.define('parent', generate);
    if (typeof fn === 'function') {
      app.fn = fn;
      fn.call(app, app, base, app.env);
    }
  }

  if (utils.isObject(app) && app.isGenerate) {
    createInstance(app, generate, app.fn);

  } else if (typeof app === 'function') {
    var Generator = generate.constructor;
    var fn = app;
    app = new Generator({name: name});
    createInstance(app, fn);

  } else {
    createInstance(app);
  }

  return app;
};
