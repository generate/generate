# Smart plugins

**Heads up!**

Most or all of the code examples in this document assume the following code exists first:

```js
var generate = require('generate');
var app = generate();
```

## What are smart plugins?

Smart plugins have all the same features and can be used the same way as regular [plugins](api/plugins.md), but they also do one or more of the following:

* [return a function](#return-a-function)
* [self-register](#self-register)
* [validate the instance](#validate-the-instance)

### Return a function

When a plugin returns a function, the function is pushed onto the `.fns` array, allowing it to be called later by the [.run](api/run.md) method. See the [.run API docs](api/run.md) for more details.

### Self-register

* **self-register**:

### Validate the instance

* **validate the instance**: plugins that validate arguments

**Example**

```js
function plugin(app) {
  // do stuff to "app" (instance of Generate),
  return function(obj) {
    // do stuff to obj
  };
}
app.use(plugin);
```