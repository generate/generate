---
title: Options
---

## Global options

TODO

## Template-specific options

File-specific options can be defined in [front-matter](front-matter.md).

### install

Define the template-specific `dependencies` and/or `devDependencies` to install after the file is generated.

**Type**: `Object`

**Default**: `undefined`

**Example**

```js
---
install
  devDependencies: ['gulp']
---
var gulp = require('gulp');

gulp.task('default', function(cb) {
  // do task stuff;
  cb();
});
```

### rename

Define default values to use for renaming a generated file.

**Type**: `Object`

**Default**: `undefined`

**Example**

A template with the following:

```js
---
rename:
  dirname: test
  basename: test.js
---

describe('when I run', function() {
  it('should do stuff', function() {
  });
});
```

Would be generated to the `test/test.js` directory, relative to the user's cwd.

**How it works**

Each property on the `rename` object maps to a property on the [file](file.md) object. If a property does not map to a field on the `file` object, it will be ignored.

### render

Disable rendering for a specific file.

**Example**

Before rendering:

```handlebars
---
render: false
title: Foo
---
<%%= title %>
```

After rendering:

```handlebars
<%%= title %>
```

### yfm

After front-matter is parsed, create a new front-matter block from the value defined on the `yfm` property.

**Type**: `Object`

**Default**: `undefined`

**Example**

Before front-matter is parsed:

```handlebars
---
foo: 'bar'
yfm: 
  title: Whatever
---
<%%= title %>
```


After front-matter is parsed:

```handlebars
---
title: Whatever
---
<%%= title %>
```
