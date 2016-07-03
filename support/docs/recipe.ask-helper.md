---
title: ask helper
tags: ['helpers', 'prompt', 'async-helper']
---

The `ask` helper is an asynchronous template helper that provides a convenient way of prompting the user for necessary information.

## Before

Without the ask helper, you would typically do something like this:

```js
app.question('name', 'What is your name?');
app.ask('name', function(err, answers) {
  if (err) return console.log(err);
  if (answers.name) {
    app.data('name', answers.name);
  }
});
```

Then in your templates:

```html
<%%= name %>
```

Upon prompting the user, the `app.data()` method passes the answer to the context, which is then used to render the `name` variable in templates.

## After

With `ask` helper we can just do:

```html
<%%= ask('name') %>
```

The user's response is automatically used to populate the template. Moreover, even if the `name` variable appears multiple times, the user is only prompted once.

**Customize the question**

If you need to customize the message, just do 

```htmlm
<%%= ask("name", "Project name?") %>
```

Or, somewhere in your config, do:

```js
app.question('name', 'Project name?');
```

and the question will automatically be used (if you're using other generators as plugins or sub-generators, this is a great way of overriding and customizing questions).


## Example

Here is an extended example of how the `ask` helper can be used.

```json
{
  "name": "<%%= ask('name') %>",
  "description": "<%%= ask('description') %>",
  "version": "<%%= ask('version') %>",
  "homepage": "https://github.com/<%%= ask('author.username') %>/<%%= ask('name') %>",
  "author": "<%%= ask('author.name') %> (<%%= ask('author.url') %>)",
  "repository": "<%%= ask('author.username') %>/<%%= ask('name') %>",
  "bugs": {
    "url": "https://github.com/<%%= ask('author.username') %>/<%%= ask('name') %>/issues"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "license": "MIT",
  "scripts": {
    "test": "mocha"
  }
}
```

Then, in your config:

```js
module.exports = function(app) {
  app.question('name', 'Project name?');
  app.question('description', 'Project description?');
  app.question('version', 'Project version?');
  app.question('author.username', 'Author\'s GitHub username?');
  app.question('author.url', 'Author\'s URL?');
};
```

Now, you can use the `ask` helper with these variables anywhere in any templates in your generator project, and the user will only be prompted once for each variable.
