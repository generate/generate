# generators

Get a generator from `app.generators`.

**.getGenerator**

The `.getGenerator` method also invokes the generator function:

```js
var foo = app.getGenerator('foo');
```

**.findGenerator**

But `.findGenerator` will get the generator without invoking the function:

```js
var foo = app.findGenerator('foo');
```

## Related

**API**

* [register](register.md)
* [plugins](plugins.md)
