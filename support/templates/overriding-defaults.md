---
title: Overriding defaults
draft: true
---

### Templates

To override the `foo.tmpl` template, just add a file named `foo.tmpl` to `~/templates` (whatever user-home is on your system).

### Scaffolds

If you want to customize more than a single template, consider using a [scaffold](). Scaffolds can be used to:

- override multiple templates at once
- customize where your templates are stored,
- define default options
- define default data to use

**Example**

Each property on the exported object maps to a [target][] in the generator.

```js
// -- ~/scaffolds/my-scaffold.js --
module.exports = {
  site: {},
  docs: {}
};
```
