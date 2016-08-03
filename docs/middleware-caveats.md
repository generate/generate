# Middleware caveats

Their are many advantages to using middleware as a part of your application's build cycle, but there is also at least one common potential pitfall you should be aware of:

**A middleware will only run when called by its handler**

This means, for instance, that if you compile a view using the `.compile` method, and you never call the `.render` method, then the `.render` middleware handler will **not be called**, thus any custom `.preRender` or `.postRender` middleware you're registered will not be run.

In most cases, this should be acceptable and considered correct. However, there will be cases where this behavior causes confusion, but we know of at least a couple of ways to work around it.

### Workarounds

One solution to the "why wasn't my middleware called?" problem is to call the "missing" handlers directly. For instance, continuing with the previous example, if you need a `.render` middleware to be called, you could:

* Call the missing handlers directly, or
* Create noops to fill in build cycle gaps and trigger the handlers

**Call the missing handlers directly**

```js
app.preCompile(/./, function(view, next) {
  app.handle('preRender', view, next);
});

app.postCompile(/./, function(view, next) {
  app.handle('postRender', view, next);
});
```

This solution brings its own set of complications. In particular, now the `.preRender` method is being called after `.preCompile`, when `.preRender` should be called first. Since middleware are executed in the order in which they are defined, as long as you register all other `.preCompile` middleware after the one in the example, you should be okay. But the following workaround might be a better solution whenever possible.

**Create noops to trigger handlers**

A more reliable solution is to create noops that will trigger missing handlers, ideally without any negative side effects.

For example, instead of skipping `.render` altogether (because we only want to `.compile` a view), we could create a basic custom engine, or override the render method on a registered engine so that `.render` will not alter `view.contents`, allowing us to call `.render` instead of `.compile`.

For example, a basic noop engine might look like this:

```js
app.engine('foo', function(view, locals, cb) {
  cb(null, view);
});
```

Or, to override the `.render` method on a registered engine:

```js
var engine = app.engine('foo');
engine.render = function(view, locals, cb) {
  cb(null, view);
};
```