---
title: Middleware guidelines
related:
  doc: ['middleware']
---

Guidelines for authoring durable, reliable middleware:

- middleware should do one thing, and do it well
- middleware should self-encapsulated, and should not rely on other middleware or plugins whenever possible
- middleware should be able to run before or after any other middleware called by the same handler. For example, if two different `.onLoad` middleware are registered, either should be able to run first or last, without effecting the results of either middleware.

