/**
 * "export-files" creates an object with all helpers
 * in this directory, using the camelcased file name
 * of each file.
 */

var helpers = module.exports = require('export-files')(__dirname);

helpers.frame = require('handlebars-helper-create-frame');
helpers['link-to'] = require('helper-link-to');
