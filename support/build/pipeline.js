'use strict';

/**
 * "export-files" automatically loads any custom plugins
 * in this directory and exports them on `pipeline.*`, using
 * the camelcased file name.
 */

var pipeline = module.exports = require('export-files')(__dirname);

/**
 * Module dependencies
 */

pipeline.markdown = require('assemble-remarkable');
pipeline.reflinks = require('gulp-reflinks');
pipeline.extname = require('gulp-extname');
pipeline.drafts = require('gulp-drafts');
pipeline.sass = require('gulp-sass');
pipeline.toc = require('gulp-html-toc');
