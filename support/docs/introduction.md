---
title: Introduction
draft: true
related:
  doc: ['generators', 'generator', 'tasks', 'features', 'faq']
---

<!-- toc -->

## What is generate?

Generate is a new, open-source developer framework for automating generates of any kind in code projects.

* normalize configuration settings, verbiage, or preferences across all of your projects
* generate files that are typically excluded from the automated parts of the software lifecycle, and are often forgotten about after they're created.
* fix dates in copyrights, licenses and banners
* removing deprecated fields from project manifests
* generating settings in runtime config files, preferences in dotfiles, and so on.

## How does it work?

Generate's API has methods for [creating](#creating-generators), [registering](#registering-generators), [resolving](#resolving-generators) and [running](#running-generators) generators.

## Generaters

All "generates" are accomplished using plugins called [generators](#generators).

**What are generators?**

- Generaters are functions that are registered by name, and can be run by [command line](#command-line) or [API](#api).
- Generaters may be published to [npm](https://www.npmjs.com) using the `generator-foo` naming convention, where `foo` is the [alias](#aliases) of your generator.
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

Get the alias of an generator by removing the `generator-` substring from the begining of the full name.

## Resolving generators

When run by command line, Generate's CLI will attempt to find and run generators matching the names you've given, by first searching in the local `generator.js`, then using node's `require()` system to find locally installed generators, and last by searching for globally installed generators.

If any of the generators specified is not found, _an error is thrown and the process will exit_.

## API

by passing the names of generators to run to the `.generate`

## Generate

Generaters via CLI or API. (tasks are powered by [bach][], the same library used in [gulp][] v4.0).

The main export of the library is the `Generate` constructor function.

Generaters themselves are just functions that take an instance of `Generate`.

Generate gives you a way to automate the maintenance of files that are typically excluded from the automated parts of the software lifecycle, and thus are mostly forgotten about after they're created.

For example, if we were to sift the files in the average code project into major generic buckets we would end up with something like this:

* **code**: the actual source code of the project (compiled, lib, src, and so on)
* **dist**: the "deliverable" of the project (this could be HTML, CSS, minified JavaScript, or something similar for non-web projects)
* **docs**: documentation for the project
* **everything else**: LICENSE and copyright files, dotfiles, manifests, config files, and so on.

Generate maintains **everything else**.
