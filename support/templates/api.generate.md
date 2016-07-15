---
title: generate
related:
  api: ['generator', 'register', 'plugins']
  doc: []
---

**Prerequisites**

- [getting-started](docs/getting-started.md)


## .generate

The `.generate` method wraps the [.build](api/build.md) method to allow tasks from any registered generator or sub-generator to be run.

```js
app.generate(names[, options], callback);
```

### Params

- `names` **{String|Array}**: names of one or more tasks to run. Dot-notation may be used to specify tasks on registered generators
- `options` **{Object|Function}**: options or callback function
- `callback` **{Function}**: function that is called when all tasks are completed. 

### examples

**Run tasks with `.build`**

Run tasks on the current instance of [generate](docs/generate.md):

```js
app.task('foo', function(cb) {
  console.log('this is the "foo" task');
  cb();
});

// use `.build` to run the "foo" task
app.build('foo', function(err) {
  if (err) console.log(err);
});
```

**Run tasks with `.generate`**

Run tasks on the current instance of [generate](docs/generate.md):

```js
app.task('foo', function(cb) {
  console.log('this is the "foo" task');
  cb();
});

// use `.generate` to run the "foo" task
app.generate('foo', function(err) {
  if (err) console.log(err);
});
```

**Run a generator's tasks**

```js
app.register('orchard', function(orchard) {
  orchard.task('apple', function(cb) {
    console.log('this is the "apple" task');
    cb();
  });
});

// run the "apple" task from generator "orchard"
app.generate('orchard:apple', function(err) {
  if (err) console.log(err);
});

// -- OR --
app.generate('orchard', ['apple'], function(err) {
  if (err) console.log(err);
});
```

**Run a sub-generator's tasks**

```js
app.register('foo', function(foo) {
  foo.task('defaut', function(cb) {
    console.log('this is the "default" task on generator "foo"');
    cb();
  });

  foo.register('bar', function(bar) {
    bar.task('defaut', function(cb) {
      console.log('this is the "default" task on sub-generator "bar"');
      cb();
    });
  });
});

// run the "default" task on "foo"
app.generate('foo', ['default'], function(err) {
  if (err) console.log(err);
});

// run the "default" task on sub-generator "foo.bar"
app.generate('foo.bar', ['default'], function(err) {
  if (err) console.log(err);
});
```

