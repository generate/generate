'use strict';

var Generate = require('../..');
var generate = new Generate();

var Scaffold = require('scaffold');
var scaffold = new Scaffold();

/**
 * Add a basic "target" to our scaffold. Scaffolds are like
 * grunt "tasks" and can have any number of targets
 */

scaffold.addTarget('abc', {
  options: {
    pipeline: generate.renderFile,
    data: {
      site: { title: 'My Blog' }
    }
  },
  src: 'templates/*.hbs',
  dest: 'site',
});

/**
 * Template engine for rendering handlebars templates
 */

generate.engine('hbs', require('engine-handlebars'));

/**
 * Generate the scaffold!
 */

generate.scaffold(scaffold)
  .on('error', console.error)
  .on('data', console.log)
  .on('end', function() {
    console.log('done!');
  });
