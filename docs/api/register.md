# Register

Register an generator function by name. Similar to [.generator](generator.md) but does not invoke the generator function.

```js
app.register(name, fn);
```

**Params**

* `name` **{String}**: name of the generator to register
* `fn` **{Function}**: generator function

**Example**

```js
var Generate = require('generate');
var app = new Generate();

// not invoked until called by `.generate`
app.register('foo', function(app) {
  // do generator stuff
});

app.generate('foo', function(err) {
  if (err) return console.log(err);
});
```

## Related

**API**

* [generator](api/generator.md)
* [plugins](api/plugins.md)
