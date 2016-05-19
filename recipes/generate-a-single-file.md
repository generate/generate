# Generate a single file

This recipe shows how to generate a single file from a template. 

There are several options depending on your needs.
Here are a few, from basic to advanced.

## Easiest

The easiest and fastest way to generate a file from a template is to use the `render` command.

**Example**

```sh
$ gen render --src=foo.md --dest=bar.md
```

As long as the necessary variables are on the context, this will render any templates that have the ERB/[Lo-Dash style template](https://lodash.com/docs#template) syntax:

```html
<%= foo %>
```

Learn more about [passing data to templates](/data.md).

## Task

If you need to customize how source and dest paths are defined, how templates are rendered or anything else, you can use [tasks](/tasks.md) with generate's [file system API](/fs.md).


```js
app.task(filename, function(cb) {
  app.src('source-file.txt')
    .pipe(app.dest('destDirectory/'))
});
```

## More information

- [CLI FAQ](/faq.md#cli): answers to common CLI questions
