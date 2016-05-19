'use strict';

var argv = require('minimist')(process.argv.slice(2));
argv.cli = true;
var generate = require('..');
var app = generate(argv);

app.engine('*', require('engine-base'));

app.create('templates', {engine: '*'});
app.template('one', {
  content: 'Name: <%= ask("name") %>\nUsername: <%= ask("username") %>\nNext: <%= ask("name") %>'
});
app.template('two', {
  content: 'Name: <%= ask("name") %>\nUsername: <%= ask("username") %>\nNext: <%= ask("name") %>'
});

app.templates.getView('one')
  .render(function(err, res) {
    if (err) return console.error(err);

    console.log(res.content);
    console.log();

    app.templates.getView('two')
      .render(function(err, res) {
        if (err) return console.error(err);
        console.log(res.content);
      });
  });
