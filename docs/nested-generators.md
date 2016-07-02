# Nested generators

Generaters provide a convenient way of wrapping code that should be executed on-demand, whilst also "namespacing" the code being wrapped, and making it available to be executed using a consistent and intuitive syntax by either CLI or API.

TBC...

## TODO

* [ ] explain how nested generators work
* [ ] command line syntax
* [ ] API syntax

## Pre-requisites

* [plugins](api/plugins.md)
* [generators](generators.md)

## Sub-generators

As with [plugins](api/plugins.md), generators may be nested: _any generator can register other generators, and any generator can be registered by other generators._ We refer to nested generators as **sub-generators**.

**Example**

```js
app.register('foo', function(foo) {
  // do udpater stuff
  this.register('bar', function(bar) {
    // do udpater stuff
    this.register('baz', function(baz) {
      // do udpater stuff
      this.task('default', function(cb) {
        console.log(baz.namespace);
        cb();
      });
    });
  });
});
```

## Run nested generators

Use dot-notation to get the generator you wish to run:

```js
app.generate('foo.bar.baz', function(err) {
  if (err) return console.log(err);

});
```
