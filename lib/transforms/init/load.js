'use strict';

var cwd = require('cwd');

/**
 * Load built-in templates
 */

module.exports = function load_(verb) {
  verb.includes('**/*.md', { cwd: cwd('templates/includes')});
  verb.dotfiles('**/*.md', { cwd: cwd('templates/dotfiles')});
};
