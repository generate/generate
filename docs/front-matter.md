# Front matter

Front-matter is a section of valid [YAML](#YAML) that must be defined very first thing in a document and is delimited by triple-dashes.

When front-matter is defined in a document, {%= upper(name) %} will extract it from the document, parse it into an object using [gray-matter][], and add the resulting object onto the `view.data` object (or `file.data` if you're using a [pipeline plugin](docs/pipeline-plugins.md)).

**Example**

In `some-template.tmpl`:

```handlebars
---
title: I'm front matter
---

This is content after the front-matter.
```

Load the file using node.js `fs` module and create a view:

```js
var fs = require('fs');
var buf = fs.readFileSync('some-template.tmpl');
var {%= name %} = require('{%= name %}');
var app = {%= name %}();

// create a collection if necessary
app.create('pages');
var page = app.page('foo', {contents: buf});
console.log(page.data);
//=> {title: "I'm front matter"}

console.log(page.contents.toString());
//=> "This is content after the front-matter."
```

[base-plugins]: https://github.com/node-base/base-plugins
[gulp]: http://gulpjs.com
[generate-dest]: https://github.com/generate/generate-dest
[assemble]: https://github.com/assemble/assemble
[templates]: https://github.com/jonschlinkert/templates
[update]: https://github.com/update/update
[verb]: https://github.com/verbose/verb
[base]: https://github.com/node-base/base
[assemble-core]: https://github.com/assemble/assemble-core
[handlebars]: http://www.handlebarsjs.com/
[lodash]: https://lodash.com/
[swig]: https://github.com/paularmstrong/swig
[pug]: http://jade-lang.com
[consolidate]: https://github.com/visionmedia/consolidate.js
[vinyl]: http://github.com/wearefractal/vinyl
[generator]: https://github.com/thisandagain/generator
[getting-started]: https://github.com/taunus/getting-started
[gray-matter]: https://github.com/jonschlinkert/gray-matter
