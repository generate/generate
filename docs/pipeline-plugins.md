# Pipeline plugins

Used to transform [vinyl](http://github.com/gulpjs/vinyl) files in a stream. All [gulp](http://gulpjs.com) plugins are pipeline plugins.

**Type**: `Stream`

**Method**: `.pipe`

**Usage**: Pipeline plugins are registered with `.pipe` and are used on vinyl `file` objects in a stream.

**Example**

This example requires the [base-fs](https://github.com/node-base/base-fs) plugin (a wrapper for [vinyl-fs](http://github.com/wearefractal/vinyl-fs), install with `$ npm i base-fs`):

```js
var base = require('base');
var vfs = require('base-fs');
// any gulp plugin can be used
var gulpPlugin = require('any-gulp-plugin');

app.src('foo.hbs')
  .pipe(gulpPlugin())
```

**Special note**

If you're using [templates](https://github.com/jonschlinkert/templates) (or [assemble](https://github.com/assemble/assemble) or [verb](https://github.com/verbose/verb)), all views are vinyl files (in other words, `view` is an instance of `Vinyl`).