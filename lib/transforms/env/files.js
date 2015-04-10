'use strict';

var mm = require('micromatch');
var glob = require('globby');

/**
 * Loads files and folders from the root of the current project:
 *
 *  - Files are exposed on `this.cache.files`
 *  - Creates `this.files()`, a matching function bound to the list of files
 *
 * ```js
 * console.log(generate.files('*.js'));
 * //=> ['foo.js', 'bar.js']
 * ```
 */

module.exports = function files_() {
  var files = glob.sync(['*', 'lib/*', 'test/*'], {dot: true});

  this.files = function (patterns, opts) {
    return mm(files, patterns, opts);
  };

  this.match = function (patterns, opts) {
    return !!this.files(patterns, opts).length;
  }.bind(this);
};
