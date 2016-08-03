# Generatefile

## Creating a generator.js

A `generator.js` may contain any custom JavaScript code, but must export a function that takes an instance of Generate (`app`):

**Example**

```js
// -- generator.js --
module.exports = function(app) {
  // custom code here
};
```

Inside this function, you can define [tasks](tasks.md), additional [generators](generators.md), or any other custom JavaScript code necessary for your generator:

```js
module.exports = function(app) {
  // register a task
  app.task('default', function(cb) {
    // do task stuff
    cb();
  });

  // register a generator
  app.register('foo', function() {

  });

  // register another generator
  app.register('bar', function() {

  });
};
```