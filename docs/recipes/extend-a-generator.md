# Extending generators

> It's easy to extend a generator with the functionality, tasks and sub-generators of _another generator_.

Let's say you want to extend generator `xyz` with generator `abc`. 

```js
generate.register('abc', function(app, base, env) {
  app.task('foo', function() {});
  app.task('bar', function() {});
  app.task('baz', function() {});
});

generate.register('xyz', function(app, base, env) {
  base.getGenerator('abc').extendGenerator(app);
  
  // run tasks `foo` and `bar` from generator `abc`
  app.task('default', ['foo', 'bar'], function(cb) {
    cb()l
  });
});
```


Run _both_ generators in different contexts:

```js
generate.build('templates', function(err) {
  if (err) return console.error(err);

  generate.generator('one')
    .build('templates', function(err) {
      if (err) return console.error(err);
      console.log(generate.views.templates);
    });
});
```