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

Aliases are used for running generators. So `generate-foo` can be run from the command line by its alias `$ gen foo`, or using the API with `app.generate('foo', function() {});`.

**Can I run a generator by its full name?**

Yes. If for some reason the alias fails, like when a local/custom generator is defined using the same name as the alias of an installed generator, you can still use the installed generator by its full name.

**Alias conventions**

No dots may be used in published generator names. Aside from that, any characters considered valid by npm are fine.

### Plugin versus sub-generator?

In the description of some generators, you will see the following phrase:

> ..use this as a plugin or sub-generator in your own generator.

**Here's the difference**:

* [plugin](docs/plugins.md): extends your own generator's instance, so all of the tasks and settings from "Generator A" would be added to "Generator B", as if they were one generator.
* [sub-generator](docs/sub-generators.md): adds the generator to a "namespace" on your generator. The namespace you choose is the sub-generator's [alias](#aliases).

**Examples:**

```js
// plugin usage
app.use(require('generator-example'));

// sub-generator usage (choose whatever )
app.register('foo', require('generator-example'));
```

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
