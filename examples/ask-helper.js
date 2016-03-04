'use strict';

var argv = require('minimist')(process.argv.slice(2));
var generate = require('..');
var app = generate(argv);

app.engine('*', require('engine-base'));

app.create('templates', {engine: '*'});
app.template('doc', {
  content: 'Name: <%= ask("beep") %>\nUsername: <%= ask("boop") %>\nName: <%= ask("beep") %>'
});
app.template('doc2', {
  content: 'Name: <%= ask("beep") %>\nUsername: <%= ask("boop") %>\nName: <%= ask("beep") %>'
});

app.templates.getView('doc')
  .render(function(err, res) {
    if (err) throw err;
    console.log(res.content);
    app.templates.getView('doc2')
      .render(function(err, res) {
        if (err) throw err;
        console.log(res.content);
      });
  });
