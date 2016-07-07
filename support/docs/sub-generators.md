---
title: Sub generators
related:
  docs: ['installing-generators', 'composing-generators', 'generators']
---

Generators provide a convenient way of "wrapping" code that should be executed on-demand, whilst also _namespacing_ the code being wrapped, so that it can be explicitly targeted via CLI or API using a consistent and intuitive syntax.

**Example**

In the following example, we'll register two sub-generators, `foo` and `bar` (this is just a preview, we'll explain this code in more detail further on):

```js
// -- generator.js --
module.exports = function(app) {
  app.register('foo', function() {});
  app.register('bar', function() {});
};
```

**Run from the command line**

We can now run the generators from the command line:

```sh
$ gen foo bar
```

**Run using the API**

Or pass one or more generator names to the `.generate` method:

```js
module.exports = function(app) {
  app.register('foo', function() {});
  app.register('bar', function() {});

  app.generate(['foo', 'bar'], function(err) {
    if (err) return console.log(err);
  });
};
```

It's recommended that `.generate` be wrapped in a [task](docs/tasks.md), to delay execution until specified by the user:

```js
module.exports = function(app) {
  app.register('foo', function() {});
  app.register('bar', function() {});

  app.task('default', function(cb) {
    app.generate(['foo', 'bar'], cb);
  });
};
```


## TODO

* [ ] explain how nested generators work
* [ ] command line syntax
* [ ] API syntax

## Pre-requisites

* [plugins](api/plugins.md)
* [generators](generators.md)
* [generator.js](generator-js.md)


## Nesting generators

As with [plugins](api/plugins.md), generators may be nested: _any generator can register other generators, and any generator can be registered by other generators._ We refer to nested generators as **sub-generators**.

**Example**

```js
module.exports = function(app, base) {
  this.register('foo', function() {
    this.task('default', function(cb) {
      console.log('done!');
      cb();
    });

    this.register('bar', function() {
      this.register('baz', function() {
        this.task('default', function(cb) {
          console.log('done!');
          cb();
        });
      });
    });
  });

  // run sub-generators programatically (we wrap the call
  // to `.generate` in a task to defer execution of the
  // generator until the task is run)
  app.task('default', function(cb) {
    app.generate('foo.bar.baz', cb);
  });
};
```

## Run nested generators

Use dot-notation to get the generator you wish to run:

```js
app.generate('foo.bar.baz', function(err) {
  if (err) return console.log(err);

});
```

Or, from the command line:

```sh
# run the `default` task on gen-generator `foo`
$ gen foo
# or
$ gen foo:default
# invoke sub-generator `foo.bar`
$ gen foo.bar
# run the `default` task sub-generator `foo.bar.baz`
$ gen foo.bar.baz
# or
$ gen foo.bar.baz:default
```
