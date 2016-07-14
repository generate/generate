# Templates

TODO

## Rendering templates

TODO

## Escaping templates

With some engines, it's possible to escape specific templates that should not be evaluated at render time. This section lists the engines and escaping techniques. (pull requests for additional engines appreciated!)

### Handlebars

**quadruple-stache**

To escape handlebars templates, you can use quadruple-staches:

```handlebars
{{raw "{{{{foo}}}}"}}
\{{\{{foo}}}}
```

**backslash**

Or backslashes:

```handlebars
{{raw "{{foo}}"}}
\{{foo}}
```
