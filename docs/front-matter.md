# Front matter

## What is front-matter?

Front-matter is a section of valid [YAML](#YAML) that must be defined very first thing in a document and is delimited by triple-dashes.

**Example**

Front matter is the section inside the `---` block:

```handlebars
---
description: I'm front matter
---
This is content after the front matter.
```

## Why should I use front-matter?

Front-matter is used for setting [template-specific options](options.md#template-specific-options), or for defining template-specific variables to use when rendering a template.

## How does front-matter work?

Front-matter is extracted from a file using [gray-matter](https://github.com/jonschlinkert/gray-matter), then it's parsed into a JavaScript object and added back to `view.data`.

**Example**

The following:

```handlebars
---
title: Some page
description: I'm front matter
---
This is content after the front matter.
```

Results in:

```js
var result = {
  data: {
    title: 'Some page',
    description: "I'm front matter"
  }, 
  content: 'This is content after the front matter.'
};
```

The [file](file.md) is updated with the properties from this object. The logic looks something like this:

```js
view.contents = new Buffer(result.content);
view.data = result.data;
```
