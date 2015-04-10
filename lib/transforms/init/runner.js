'use strict';

var path = require('path');
var utils = require('../../utils');
var cache = require('../../cache');

/**
 * Set info about generate on the `runner` object. We use
 * `runner` to be consistent with other applications built
 * on Template to make debugging easier.
 *
 * ```js
 * console.log(app.runner);
 * //=> {name: 'generate', version: '0.1.0'}
 * ```
 */

module.exports = function runner_() {
  var fp = path.resolve(__dirname, '../../../package');
  var runner = cache[fp] || (cache[fp] = utils.tryRequire(fp));

  Object.defineProperty(this, 'runner', {
    get: function () {
      return {name: runner.name, version: runner.version};
    },
    set: function (val) {
      throw new Error('generate#runner is a read-only property.');
    }
  });
};
