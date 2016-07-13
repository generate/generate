---
title: Installing the cli
related:
  doc: ['installing-generators']
---

To run generate from the command line, you'll need to install Generate's CLI globally first. You can do that now with the following command:

```sh
$ npm install --global generate
```

This adds the `gen` command to your system path, allowing it to be run from any directory.

**Verify installation**

You should now be able to use the `gen` command to execute code in a local `generator.js` file, or to execute globally installed generators by their [aliases](docs/#generator-aliases).

To verify that Generate's CLI is installed, run the following command:

```sh
$ gen --version
```

## help

```console
$ gen help

  Usage: gen <command> [options]

  Command: generator or tasks to run

  Options:

    --config, -c      Save a configuration value to the `gen` object in package.json
    --cwd             Set or display the current working directory
    --data, -d        Define data. API equivalent of `app.data()`
    --disable         Disable an option. API equivalent of "app.disable('foo')"
    --enable          Enable an option. API equivalent of "app.enable('foo')"
    --global, -g      Save a global configuration value to use as a default
    --help, -h        Display this help menu
    --init, -i        Prompts for configuration values and stores the answers
    --option, -o      Define options. API equivalent of `app.option()`
    --run             Force tasks to run regardless of command line flags used
    --silent, -S      Silence all tasks and updaters in the terminal
    --show <key>      Display the value of <key>
    --version, -V     Display the current version of generate
    --verbose, -v     Display all verbose logging messages

  Examples:

    # run generator "foo"
    $ gen foo

    # run task "bar" from generator "foo"
    $ gen foo:bar

    # run multiple tasks from generator "foo"
    $ gen foo:bar,baz,qux

    # run a sub-generator from generator "foo"
    $ gen foo.abc

    # run task "xyz" from sub-generator "foo.abc"
    $ gen foo.abc:xyz

    Generate attempts to automatically determine if "foo" is a task or generator.
    If there is a conflict, you can force generate to run generator "foo"
    by specifying its default task. Example: `$ gen foo:default`
```
