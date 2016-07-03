### Install generate

```sh
$ npm install --global generate
```

This adds the `gen` command to your system path, allowing it to be run from any directory. You should be able to run generate using the `gen` command.

### Install a generator

Install `generate-example`:

```sh
$ npm install --global generate-example
```

### Run a generator

Run `generate-example`

```sh
$ gen example
```

If `generate-example` has a `default` task, it was invoked with the `$ gen example` command. Otherwise the generator function was invoked.

### Run a task

Run the `foo` task registered on `generate-example`:

```sh
$ gen example:foo
```

### Run a sub-generator

Run sub-generator `xyz` registered on `generate-example`:

```sh
$ gen example.xyz
```

If sub-generator `example.xyz` has a `default` task, it was invoked with the `$ gen example.xyz` command. Otherwise the generator function was invoked.

### Run a task on a sub-generator

Run task `abc` registered on sub-generator `example.xyz`:

```sh
$ gen example.xyz:abc
```
