---
title: Generatefile
related:
  doc: ['installing-generators', 'generators', 'tasks']
---

Each time `generate` is run, Generate's CLI looks for an `generator.js` in the current working directory.

**If `generator.js` exists**

Generate's CLI attempts to:

* Load a local installation of the Generate library using node's `require()` system, falling back to global installation if not found.
* Load the configuration from `generator.js` using node.js `require()` system
* Register it as the ["default" generator](generators.md#default-generator)
* Execute any tasks or generators you've specified for it to run.
* If multiple task or generator names are specified on the command line, Generate's CLI will attempt to run

**If `generator.js` does not exist**

Generate's CLI attempts to:

* Find any generators you've specified for it to run by using node's `require()` system to search for locally installed modules with the name `generator-*`,


## Creating an generator.js

An `generator.js` may contain any custom JavaScript code, but must export a function that takes an instance of Generate (`app`):

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

  // register an generator
  app.register('foo', function() {

  });

  // register another generator
  app.register('bar', function() {

  });
};
```
