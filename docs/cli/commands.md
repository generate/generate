# CLI Commands

Available command line options.

## install

**flag**: `--install`

Automatically install npm dependencies and devDependencies after files are written.

## no-install

**flag**: `--no-install`

Skip automatic installation of npm dependencies and devDependencies after files are written.

## default

**flag**: `--default`

**abbr**: `-D`

Save the given task arguments as the default tasks to run with the `gen` command.

**Example**

```sh
$ gen foo bar baz -D
```

**Delete defaults**

To delete all stored default tasks, add the `--del` flag:

```sh
$ gen -D --del
```

Flags can be specified in any order.

[base-plugins]: https://github.com/node-base/base-plugins
[gulp]: http://gulpjs.com
