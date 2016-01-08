_(WIP)_

### help

_(TODO)_

Get started with Generate.

```js
$ gen help
```

### init

_(TODO)_

Get started with Generate.

```js
$ gen init
```

Upon running `init`, generate will prompt you for answers to the following questions:


### Run generators

```sh
$ gen <generator name> [options]
```

**Example**

Run generator `abc`

```sh
$ gen abc
```

### Run tasks

To run a task on the `base` generator, just pass the name of the task to run.

```sh
$ gen <task name> [options]
```

Unless overridden by the user, the `base` generator is the default generator that ships with Generate. This generator doesn't really "generate" anything, but it will prompt you for a few answers (if you choose), to store data that's commonly needed by templates, like `author.name`, GitHub `username`, etc.

**Example**

Run task `bar`:

```sh
$ gen bar
```

### Run sub-generators

> Sub-generators are normal generators that are called from (or registered by) other generators.

Dot-notation is used for getting and runing sub-generators. 

```sh
$ gen <generator name>.<sub-generator name> [options]
```

**Examples**

Run sub-generator `b` on generator `a`:

```sh
$ gen a.b [options]
```

Run sub-generator `c`:

```sh
$ gen a.b.c [options]
```

And so on...


### Run a generator's tasks

```sh
$ gen <generator name>:<task name> [options]
```

**Example**

Run task `bar` on generator `foo`.

```sh
$ gen foo:bar 
```

### Run a sub-generator's tasks

```sh
$ gen <generator name>.<sub-generator name>:<task name> [options]
```

**Example**

Run task `foo` on sub.generator `a.b.c`.

```sh
$ gen a.b.c:foo 
```
