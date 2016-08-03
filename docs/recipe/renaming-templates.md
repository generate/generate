# Easily renaming templates

This recipe shows how to automatically rename templates based on values defined in YAML front matter. For other solutions see the [renaming files recipe](renaming-files.md).

It often makes sense to use a different name for a template than the actual destination name. For example, you might have 5 different templates that could end up as `index.js`, depending on responses to prompts, etc.

**Front matter**

To change any path part on the `file` object, just define a `rename` object in the yaml front-matter of the template.

**Example**

Given you have some templates:

* `templates/foo.js`
* `templates/bar.js`
* `templates/baz.js`

If you add front-matter with the following to each of them:

```js
---
rename:
  basename: index.js
---

// This is a template
function foo() {
}
```

Generate will automatically rename the files before writing them to the file system. This is done with a simple `.preWrite` middleware, that looks something like this:

```js
var isObject = require('isobject');

app.preWrite(/./, function(file, next) {
  // "file" is a vinyl file, and "file.data" is the front-matter object
  var data = utils.extend({}, file.data);
  if (isObject(data.rename)) {
    for (var key in data.rename) {
      file[key] = data.rename[key];
    }
  }
  next();
});
```