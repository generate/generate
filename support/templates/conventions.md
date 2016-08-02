---
title: Conventions
---

## Templates

**Dotfiles**

All dotfile templates are prefixed with an underscore to prevent programs from mistaking them as real files.

Example: `_gitignore`

**Manifest files** 

Manifest files are prefixed with `$`. This includes `package.json` for node.js, or other similar config files that should not be confused for real files. 

Example: `$package.json`

## Silencing tasks

When `{silent: true}` is passed as the second argument to `app.task()`,  the `starting` and `finished` events are hidden in the terminal. 

If a generator has more than one task, a best practice is to silence the following tasks:

### default task

In cases where the `default` task is an alias for another task, silencing it will prevent "duplicate" events from being displayed for the same task.

**Example**

```js
app.task('default', {silent: true}, ['foo']);
```

### "prompt" tasks

Prompt tasks are tasks that prompt the user for feedback before taking any action. But the following really applies to any tasks that are _likely to be called programmatically_ as part of a build workflow, versus being called explicitly in the command line by a user. 

**Example**

When you publish a generator that is used as a plugin or sub-generator, the other generator may wish to "re-label" (through aliases) or hide the output of your generator's tasks. This is particularly relevant when another generator calls a "prompt task" on your generator. 

This is good practice:

```js
app.task('prompt-foo', {silent: true}, function(cb) {
  // do stuff
  cb();
});
```

<a name="aliases"></a>
## Generator aliases

**What's a "generator alias"?**

A generator's alias is created by stripping the substring `generate-` from the _full name_ of generator.

**What are they used for?**

Generate tries to find globally installed generators using an "alias" first, falling back on the generator's full name if not found by its alias. Thus, when publishing a generator the naming convention `generate-foo` should be used (where `foo` is the alias, and `generate-foo` is the full name).

**Alias conventions**

No dots may be used in published generator names. Aside from that, any characters considered valid by npm are fine.

## Task aliases

Task aliases are just tasks that only exist to reference another task or tasks.

**Example**

Here, the `default` task is an alias for the `foo` task.

```js
app.task('foo', function() {});
app.task('default', ['foo']);
```

**Why use aliases?**

Typically aliases are used as as a convenience to make it easier to call multiple tasks. For example:

```js
app.task('foo', function() {});
app.task('bar', function() {});
app.task('default', ['foo', 'bar']);
```

See the [Best Practices Guide](https://github.com/generate/best-practices/naming-tasks) for advice on naming tasks.


## Related

- [renaming files](#renaming-files): how to rename templates to destination files
- [automatically renaming templates](#renaming-templates): how to automatically rename templates based on values defined in YAML front matter

[generate-gulp]: https://github.com/generate/generate-gulp
