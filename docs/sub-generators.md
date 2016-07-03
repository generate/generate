# Sub generators

Generaters provide a convenient way of wrapping code that should be executed on-demand, whilst also "namespacing" the code being wrapped, and making it available to be executed using a consistent and intuitive syntax by either CLI or API.

TBC...

## TODO

* [ ] explain how nested generators work
* [ ] command line syntax
* [ ] API syntax

## Pre-requisites

* [plugins](api/plugins.md)
* [generators](generators.md)

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
