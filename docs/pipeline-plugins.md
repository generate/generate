# Pipeline plugins

Used to transform [vinyl][] files in a stream. All [gulp][] plugins are pipeline plugins.

**Type**: `Stream`

**Method**: `.pipe`

**Usage**: Pipeline plugins are registered with `.pipe` and are used on vinyl `file` objects in a stream.

**Example**

This example requires the [base-fs][] plugin (a wrapper for [vinyl-fs][], install with `$ npm i base-fs`):

```js
var base = require('base');
var vfs = require('base-fs');
// any gulp plugin can be used
var gulpPlugin = require('any-gulp-plugin');

app.src('foo.hbs')
  .pipe(gulpPlugin())
```

**Special note**

If you're using [templates][] (or [assemble][] or [verb][]), all views are vinyl files (in other words, `view` is an instance of `Vinyl`).

## Related

**Docs**

* [middleware](middleware.md)
