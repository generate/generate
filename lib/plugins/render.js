'use strict';

/**
 * Module dependencies.
 */

var merge = require('mixin-deep');
var PluginError = require('plugin-error');
var through = require('through2');

/**
 * Expose `render` plugin
 */

module.exports = function(app, config) {
  return function renderPlugin(locals, options) {
    locals = locals || {};
    locals.options = locals.options || {};

    return through.obj(function (file, enc, cb) {
      if (file.isNull()) {
        this.push(file);
        return cb();
      }
      if (file.isStream()) {
        this.emit('error', new PluginError('render-plugin', 'Streaming is not supported.'));
        return cb();
      }

      locals = merge({}, locals, file.locals);
      locals.options = merge({}, app.options, locals.options);

      // if (norender(app, file.ext, file, locals)) {
      //   this.push(file);
      //   return cb();
      // }

      var template = app.getFile(file);
      template.content = file.contents.toString();

      try {
        var stream = this;
        template.render(locals, function (err, content) {
          if (err) {
            stream.emit('error', new PluginError('render-plugin', err));
            cb(err);
            return;
          }
          file.contents = new Buffer(content);
          stream.push(file);
          return cb();
        });

      } catch (err) {
        this.emit('error', new PluginError('render-plugin', err));
        return cb();
      }
    });
  };
}

/**
 * Push the `file` through if the user has specfied
 * not to render it.
 */

function norender(app, ext, file, locals) {
  return !app.engines.hasOwnProperty(ext)
    || app.isTrue('norender') || app.isFalse('render')
    || file.norender === true || file.render === false
    || locals.norender === true || locals.render === false;
}
