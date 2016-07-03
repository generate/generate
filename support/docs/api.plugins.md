---
title: Plugins
related:
  api: ['generator', 'register']
  doc: []
---

A plugin is function that takes an instance of `Generate` and is registered with the `.use` method. See the [base-plugins][] documentation for additional details.

**Heads up!**

Most or all of the code examples in this document assume the following code exists first:

```js
var generate = require('generate');
var app = generate();
```

### .use

The `.use` method is used for registering plugins that should be immediately invoked.

**Example**

```js
function plugin(app) {
  // "app" and "this" both expose the instance of generate we created above
}

app.use(plugin);
```

Once a plugin is invoked, it will not be called again.

### .run

If a plugin returns a function after it's invoked by `.use`, the function will be pushed onto an array allowing it to be called again by the `.run` method.

**Example**

```js
function plugin(app) {
  // "app" and "this" both expose the instance of generate we created above
  return plugin;
}

app.use(plugin);
```

We can now run all plugins that were pushed onto the `.fns` array on any arbitrary object:

```js
var obj = {};
app.run(obj);
```

Additionally:

* If `obj` has a `.use` method, it will be used on each plugin (e.g. `obj.use(fn)`). Otherwise `fn(obj)`.
* If the plugin returns a function again and `obj` has a `.run` method, the plugin will be pushed onto the `obj.fns` array

This can continue indefinitely as long as the plugin returns a function and the receiving object has `.use`/`.run` functions.

## Generaters

When plugins are [registered by name](docs/generators.md), they are referred to as "generators". See the [generator documentation](docs/generators.md) for more details.
