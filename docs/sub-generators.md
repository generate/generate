# Sub generators

Generaters provide a convenient way of "wrapping" code that should be executed on-demand, whilst also "namespacing" the code being wrapped, so that it's available to be executed and can be explicitly targeted via CLI or API, using a consistent and intuitive syntax across both interfaces.

**Example**

We will explain this code in more detail below, but here is a preview of how sub-generators work.

```js
// -- generator.js --
module.exports = function(app) {

};
```



TBC...

## TODO

* [ ] explain how nested generators work
* [ ] command line syntax
* [ ] API syntax

## Pre-requisites

* [plugins](api/plugins.md)
* [generators](generators.md)
* [generator.js](generator-js.md)

***


Use as a [sub-generator]({%= platform.docs %}/generators.md) if you want to add `{%= name %}` to a  _namespace_ in your generator:

```js
module.exports = function(app) {
  // register the {%= name %} with whatever name you want
  app.register('foo', require('{%= name %}'));
};
```


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
