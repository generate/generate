# Installing the cli

To run generate from the command line, you'll need to install Generate's CLI globally first. You can do that now with the following command:

```sh
$ npm install --global generate
```

This adds the `generate` command to your system path, allowing it to be run from any directory.

You should now be able to use the `generate` command to execute code in a local `generator.js` file, or to run any locally or globally installed generators by their [aliases](tasks.md#alias-tasks) or full names.

**Init**

If it's your first time using generate, run `generate init` to set your global defaults.

**CLI help**

```
Usage: generate <command> [options]

Command: Generater or tasks to run

Examples:

  # run the "foo" generator
  $ generate foo

  # run the "bar" task on generator "foo"
  $ generate foo:bar

  # run multiple tasks on generator "foo"
  $ generate foo:bar,baz,qux

  # run a sub-generator on generator "foo"
  $ generate foo.abc

  # run task "xyz" on sub-generator "foo.abc"
  $ generate foo.abc:xyz

  Generate attempts to automatically determine if "foo" is a task or generator.
  If there is a conflict, you can force generate to run generator "foo"
  by specifying a task on the generator. Example: `generate foo:default`
```

## Related

**Docs**

* [installing-generators](installing-generators.md)
