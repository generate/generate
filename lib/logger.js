'use strict';

var Emitter = require('component-emitter');

function Logger(options) {
  this.options = options || {};
}

Emitter(Logger.prototype);

Logger.prototype.write = function(msg) {
  return process.stdout.write(msg);
};

Logger.prototype.log = function(msg) {
  this.emit('log', msg);
  return this;
};

Logger.prototype.info = function(msg) {
  this.emit('info', msg);
  return this;
};

Logger.prototype.error = function(msg) {
  this.emit('error', msg);
  return this;
};

Logger.prototype.warn = function(msg) {
  this.emit('warn', msg);
  return this;
};

/**
 * Expose `Logger`
 */

module.exports = Logger;
