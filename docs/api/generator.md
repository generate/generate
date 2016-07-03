# generater

Register a generator function by name. Similar to [.register](register.md) but immediately invokes the generator function upon registering it.

```js
app.generator(name, fn);
```

**Params**

* `name` **{String}**: name of the generator to register
* `generator` **{Function}**: generator function

**Example**

```js
var Generate = require('generate');
var app = new Generate();

// immediately invoked
app.generator('bar', function(app) {
  // do generator stuff
});

app.generate('bar', function(err) {
  if (err) return console.log(err);
});
```

## Related

**API**

* [register](api/register.md)
* [plugins](api/plugins.md)
