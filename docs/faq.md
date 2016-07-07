# Faq

## How is the name written?

**Generate**

Generate, with a capital "G", the rest lowercase.

**generator.js**

The file, `generator.js` is all lowercase, no capital letters.

<a name="aliases"></a>

### Generator aliases

**What's a "generator alias"?**

A generator's alias is created by stripping the substring `generate-` from the _full name_ of generator.

**What are they used for?**

Generate tries to find globally installed generators using an "alias" first, falling back on the generator's full name if not found by its alias. Thus, when publishing a generator the naming convention `generate-foo` should be used (where `foo` is the alias, and `generate-foo` is the full name).

**Alias conventions**

No dots may be used in published generator names. Aside from that, any characters considered valid by npm are fine.

### Task aliases

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

**Docs**

* [features](features.md)

[base-plugins]: https://github.com/node-base/base-plugins
[gulp]: http://gulpjs.com
[generate-dest]: https://github.com/generate/generate-dest
