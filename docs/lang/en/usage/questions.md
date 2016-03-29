# Answers

## Caches

### .sessionAnswers

### .answers

Actual answers given by the user for an instance.

### .data

## Stores

### .globals.data

### .store.data

### .hints.data


Ask questions

```sh
$ gen ask
```

Ask specific questions

```sh
$ gen ask:project ask
```

Clear all questions:

```sh
$ gen ask:clear
```

**Examples**

Ask specific questions, and ensure that no other questions are queued:

```sh
$ gen ask:clear ask:project ask
```

```sh
$ gen ask:clear readme:author ask:project ask readme
```


```js
module.exports = function() {
  app.task('author', function(cb) {

    cb();
  });
};
```
