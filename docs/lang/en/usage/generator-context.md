# Context lifecycle

## terminology used in this document

- **template**: a visual representation of how the data in the `rendered` object is created, not necessarily an actual template (although it could be)
- **rendered**: the desired final object

## Stores

**persisted**

- `app.store.data`: global data store
- `app.local.data`: local data store
- `app.pkg.data`: object created from the `package.json` for a project

**in memory**

- `app.answers.data`: object created from answers to user prompts: **on base**
- `app.cache.data`: object created from the `app.data()` API


## Global data store

**template**

```json
{
  "author": {
    "name": "Jon Schlinkert",
    "username": "jonschlinkert",
    "url": "https://github.com/<%= username %>",
    "twitter": "<%= twitter || username %>"
  }
}
```

**rendered**

```json
{
  "author": {
    "name": "Jon Schlinkert",
    "username": "jonschlinkert",
    "url": "https://github.com/<%= username %>",
    "twitter": "<%= twitter || username %>"
  }
}
```

## Local data store

**Helpers**

```js
app.helper('owner', function(pkg) {
  if (app.local.has('owner')) {
    return app.local.get('owner');
  }
  var repo = pkg.repository;
  if (utils.isObject(repo)) {
    repo = repo.url;
  }
  if (typeof repo === 'string') {
    var obj = parseGithubUrl(repo);
    app.local.set(obj);
  }
  return obj.owner;
});
```

```json
{
  "project": {
    "name": "<%= pkg.data.name %>",
    "description": "<%= pkg.data.description %>",
    "owner": "<%= owner(pkg.data) %>",
    "repo": "<%= project.owner %>/<%= <%= pkg.data.name %>",
    "homepage": "<%= pkg.data.homepage || ('http://github.com/' + project.owner + '/' + pkg.data.name) %>"
  }
}
```

## package.json original

```json
{
  "name": "my-project",
  "description": "this is a great project",
  "author": {
    "name": "Jon Schlinkert",
    "username": "jonschlinkert",
    "url": "https://github.com/<%= username %>",
    "twitter": "<%= twitter || username %>"
  }
}
```

## Expanded

**template**

```json
{
  "project": {
    "name": "my-project",
    "description": "this is a great project",
    "owner": "jonschlinkert",
    "repo": "<%= project.owner %>/<%= project.name %>",
    "homepage": "http://<%= project.owner %>.github.io/<%= project.name %>",
    "repository": {
      "url": "https://github.com/jonschlinkert/my-project.git"
    }
  },
  "author": {
    "name": "Jon Schlinkert",
    "username": "jonschlinkert",
    "url": "https://github.com/<%= username %>",
    "twitter": "<%= twitter || username %>"
  }
}
```

**rendered**

```json
{
  "project": {
    "name": "my-project",
    "description": "this is a great project",
    "repository": {
      "url": "https://github.com/my-project.git"
    }
  },
  "author": {
    "name": "Jon Schlinkert",
    "username": "jonschlinkert",
    "url": "https://github.com/<%= username %>",
    "twitter": "<%= twitter || username %>"
  }
}
```

## Context

**template**

```json
{
  "name": "my-project",
  "owner": "<%= owner || author.username %>",
  "author": {
    "name": "Jon Schlinkert",
    "username": "jonschlinkert",
    "url": "https://github.com/<%= username %>",
    "twitter": "<%= twitter || username %>"
  }
}
```

**rendered**

```json
{
  "name": "my-project",
  "owner": "<%= owner || author.username %>",
  "author": {
    "name": "Jon Schlinkert",
    "username": "jonschlinkert",
    "url": "https://github.com/<%= username %>",
    "twitter": "<%= twitter || username %>"
  }
}
```

## Condensed

**template**

```json
{
  "name": "<%= project.name %>",
  "author": "<%= author.name %> <%= author.email ? ('<' + author.email + '> ') : '' %>(<%= author.url %>)",
  "repository": "https://github.com/<%= project.owner || author.username %>"
}
```

**rendered**

```json
{
  "name": "my-project",
  "author": "Jon Schlinkert (https://github.com/jonschlinkert)",
  "repository": "https://github.com/jonschlinkert"
}
```