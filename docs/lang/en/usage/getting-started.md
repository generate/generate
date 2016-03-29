# Getting started

Generate and generate plugins are installed and managed via [npm](https://npmjs.org/), the [Node.js](http://nodejs.org/) package manager. Generate requires stable Node.js versions `>= 0.10.0`. Odd version numbers of Node.js are considered unstable development versions.

Before setting up generate ensure that your [npm](https://npmjs.org/) is up-to-date by running `npm update -g npm` (this might require `sudo` on certain systems).

If you've already installed generate and are now looking for a quick reference, please take a look at our [`generator.js` example](http://github.com/generate/generate/blob/master/docs/example-generator.md) and how to [configure a task](http://github.com/generate/generate/blob/master/docs/configuring-tasks.md).

## Installing generate

To get started and to take advantage of generate's command line interface (CLI), you first need to install `generate` globally. You may need to use sudo (for OSX, *nix, BSD etc) or run your command shell as Administrator (for Windows) to do this.

```shell
npm install -g generate
```

This will put the `generate` command in your system path, allowing it to be run from any directory.

## How the CLI works

Each time `generate` is run, it looks for a locally installed `generator.js` using node's `require()` system. Because of this, you can run `generate` from any subfolder in your project.

_(This document is based on the excellent [grunt docs](https://github.com/gruntjs/grunt-docs))_