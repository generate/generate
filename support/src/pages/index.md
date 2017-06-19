---
layout: default
slug: index
geopattern: e
---

## What is {{@site.name}}?

{{titleize @site.name}} is a node.js library for composing and running prompts in the terminal.

**What's different about {{@site.name}}?**

{{titleize @site.name}} itself can be thought of as a "prompt runner" that only ships with one prompt type, [input][prompt-text], and additional [prompt types](#prompt-types) are added as plugins.

This makes {{@site.name}} lighter, faster, easier to maintain and easier to extend than other prompt libraries, like [inquirer][]. {{titleize @site.name}} also supports the same question formats as [inquirer][], as well as additional formats that make it easier to create.

### Prompt types

The following prompt types are maintained by the {{titleize @site.name}} core team. Each is published as a separate library and can be used completely standalone, or as a plugin to {{titleize @site.name}}.

{{> prompt-types }}

Visit the [prompts documentation](prompts.html) to learn more about using, discovering and authoring prompts.

## Quickstart

**1. Install**

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save {{@site.name}}
```

**2. Prompt**

Add the following code to `example.js` then run `$ node example`:

```js
var {{titleize @site.name}} = require('{{@site.name}}');
var {{@site.name}} = new {{titleize @site.name}}();

{{@site.name}}.question('first', 'First name?');
{{@site.name}}.question('last', 'Last name?');

{{@site.name}}.prompt(['first', 'last'])
  .then(function(answers) {
    console.log(answers)
  });
```

## Next steps

- Visit the [{{@site.name}} documentation](docs.html) for more detailed usage instructions.
- [Discover prompts](https://www.npmjs.com/browse/keyword/{{@site.name}}) created by the community or the {{titleize @site.name}} core team
- Learn how to [Author prompts](prompts.html)
- [See examples](examples.html)

## Resources

- [Terminal cheatsheet](https://gist.github.com/jonschlinkert/a5284f250e98cfeb76edc8f223eb06ae)
