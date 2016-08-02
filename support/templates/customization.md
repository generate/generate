---
title: Overriding defaults
draft: true
---

## Templates

You can override a template by adding a template of the same name to the `templates` directory in user home. 

For example, to override the `foo.tmpl` template, just add a file named `foo.tmpl` to `~/templates`, where `~/` is user-home on your system (the directory that `os.homedir()` returns).

## Scaffolds

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

## Destination directory

To customize the destination directory, install [generate-dest][] globally, then in the command line prefix `dest` before any other {%= platform.configname %} names. 

For example, the following will prompt you for the destination path to use, then pass the result to `{%= name %}`:

```sh
$ {%= platform.command %} dest {%= alias %}
```
