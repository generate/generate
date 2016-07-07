---
title: Introduction
draft: true
related:
  doc: ['generators', 'generator', 'tasks', 'features', 'faq']
---

<!-- toc -->

## How does it work?

Generate's API has methods for [creating](#creating-generators), [registering](#registering-generators), [resolving](#resolving-generators) and [running](#running-generators) generators.

## Generators

All "generates" are accomplished using plugins called [generators](#generators).

**What are generators?**

- Generators are functions that are registered by name, and can be run by [command line](#command-line) or [API](#api).
- Generators may be published to [npm](https://www.npmjs.com) using the `generator-foo` naming convention, where `foo` is the [alias](#aliases) of your generator.
- Published generators can be installed locally or globally.

## Command line

### Running generators

To run generators by command line, pass the [aliases](#aliases) or full [npm](https://www.npmjs.com) package names (if published) of the generators to run after the `generate` command.

**Example**

Run generators `foo`, `bar` and `baz` in series:

```sh
$ generate foo bar baz
# or
$ generate generator-foo generator-bar generator-baz
```

Note that _generators are run in series_, so given the previous example, generator `bar` will not run until generator `foo` is completely finished executing.

### Aliases

Get the alias of a generator by removing the `generator-` substring from the begining of the full name.

## Resolving generators

When run by command line, Generate's CLI will attempt to find and run generators matching the names you've given, by first searching in the local `generator.js`, then using node's `require()` system to find locally installed generators, and last by searching for globally installed generators.

If any of the generators specified is not found, _an error is thrown and the process will exit_.

## API

by passing the names of generators to run to the `.generate`
