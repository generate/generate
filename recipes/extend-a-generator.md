# Extending generators

It's easy to extend a generator with the functionality, tasks and sub-generators of another generator.

Let's say you want to extend generator `xyz` with generator `abc`. 

```js
generate.register('abc', function(app, base, env) {
});

generate.register('xyz', function(app, base, env) {
  base.on('preBuild', function() {
    var abc = base.getGenerator('abc');
    abc.extendGenerator(app);
  });
});
```

**Pro tip**

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