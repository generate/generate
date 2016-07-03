# Renaming files

To rename templates to the actual paths to be used before files are written to the file system, you can do one of the following:

* **plugin**: use a plugin like [gulp-rename][] or [gulp-extname][]. This is a good choice if you need to use different renaming settings on every task where files are written
* **middleware**: use a `preWrite` middleware that will be used on all files that match the given regex pattern, and will run whenever `app.dest()` is called.

**Middleware example**

The following middleware will rename all template files that follow generate's template [naming conventions] to the correct destination file names.

* `_dotfile` renames to `.dotfile`
* `$package.json` renames to `package.json`

```js
// add this code before app.src/app.dest
app.preWrite(/^[_$]/, function(file, next) {
  file.basename = file.basename.replace(/^_/, '.').replace(/^\$/, '');
  next();
});
```
