# Built in generators

Generate only has a few built-in [generators](docs/generators.md) (these might be externalized at some point):

* [init](#init): Choose the generators to run by default each time `generate` is run from the command line
* [list](#list): List all globally and locally installed generators
* [show](#show): show the list of generators that will run on the current project when the `generate` command is given
* [new](#new): create a new `generator.js` in the current working directory
* [help](#help): show a help menu with all available commands

## Usage

### init

Choose the generators to run by default each time `generate` is run from the command line:

```sh
$ generate init
```

### list

List all globally and locally installed generators:

```sh
$ generate list
```

### show

Show the list of generators that will run on the current project when the `generate` command is given:

```sh
$ generate show
```

### new

Create a new `generator.js` in the current working directory:

```sh
$ generate new
```

### help

Display a help menu with all available commands:

```sh
$ generate help
```