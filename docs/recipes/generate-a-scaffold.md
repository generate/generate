# Generate scaffolds

> This recipe shows how to generate a project from a scaffold

## Create a scaffold

Before we do anything, we need to create a basic scaffold to use in the examples:

**Example**

```js
var scaffold = require('scaffold')({
  cwd: 'examples/fixtures'
});

// Add a basic "target" to the scaffold
scaffold.addTarget('abc', {
  src: 'templates/*.hbs', 
  dest: 'site',
});


// add "targets" to the scaffold
scaffold.addTarget('abc', {
  // dest "base" 
  options: { destBase: 'two' },

  // data to pass to templates
  data: { name: 'Jon' },

  // Files to generate. (you can use any
  // files configuration that grunt accepts)
  files: [
    {src: '*.txt', dest: 'a'},
    {src: '*.txt', dest: 'b'},
    {src: '*.txt', dest: 'c'},
  ]
});



```js
var through = require('through2');
var generate = require('generate')();

scaffold.addTargets({
  a: {
    options: {
      cwd: 'examples/fixtures',
      destBase: 'two',
      pipeline: ['foo']
    },
    data: {name: 'Jon'},
    files: [
      {src: '*.txt', dest: 'a', options: {pipeline: ['foo', 'bar']}},
      {src: '*.txt', dest: 'b'},
      {src: '*.txt', dest: 'c'},
      {src: '*.md', dest: 'md', data: {name: 'Jon'}},
    ]
  }
});

generate.scaffold(scaffold, function(err) {
  if (err) throw err;
  console.log('finished');
});
```


```js
var through = require('through2');
var scaffold = require('scaffold')({cwd: 'examples/fixtures'});
var generate = require('generate')();

scaffold.addTargets({
  a: {
    options: {
      cwd: 'examples/fixtures',
      destBase: 'two',
      pipeline: ['foo']
    },
    data: {name: 'Jon'},
    files: [
      {src: '*.txt', dest: 'a', options: {pipeline: ['foo', 'bar']}},
      {src: '*.txt', dest: 'b'},
      {src: '*.txt', dest: 'c'},
      {src: '*.md', dest: 'md', data: {name: 'Jon'}},
    ]
  },
  b: {
    cwd: 'examples/fixtures',
    destBase: 'one',
    data: {name: 'Brian'},
    files: [
      {src: '*.txt', dest: 'a'},
      {src: '*.txt', dest: 'b'},
      {src: '*.txt', dest: 'c'},
      {src: '*.md', dest: 'md', data: {name: 'Brian'}},
    ]
  }
});

generate.plugin('foo', function(options) {
  return through.obj(function(file, enc, next) {
    file.content += '\nfoo';
    next(null, file);
  });
});

generate.plugin('bar', function(options) {
  return through.obj(function(file, enc, next) {
    file.content += '\nbar';
    next(null, file);
  });
});

generate.scaffold(scaffold, function(err) {
  if (err) throw err;
  console.log('finished');
});
```