# MarkdownEditor

## Use

Fork and setup for your use.

Build

```
$ npm install -g webpack
$ npm install
$ gulp build
```

Take it.

```
<script src='/dist/bundle.js'></script>
<script>
window.onload = function(){
  window.createMyEditor(document.body, {});
}
</script>
```

## Develop

```
$ gulp watch
```

See demo/index.html

## Load by webpack

Need this setting.

```
  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee" },
      { test: /\.css$/   , loader: "style!css?root=." }
    ]
  },
```

I recommend bundled file via script.
