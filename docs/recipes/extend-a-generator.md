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
  app.extendWith('abc');
  
  // run tasks `foo` and `bar` from generator `abc`
  app.build(['foo', 'bar'], function(err) {
    if (err) throw err;
  });
});
```
