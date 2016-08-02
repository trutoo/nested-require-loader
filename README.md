[![Build Status](https://img.shields.io/travis/markdalgleish/web-app-manifest-loader/master.svg?style=flat-square)](http://travis-ci.org/markdalgleish/web-app-manifest-loader) [![Coverage Status](https://img.shields.io/coveralls/markdalgleish/web-app-manifest-loader/master.svg?style=flat-square)](https://coveralls.io/r/markdalgleish/web-app-manifest-loader) [![npm](https://img.shields.io/npm/v/web-app-manifest-loader.svg?style=flat-square)](https://www.npmjs.com/package/web-app-manifest-loader)

# nested-require-loader

Simply resolves any require calls nested in a file using [webpack](https://github.com/webpack/webpack).

```bash
$ npm install --save-dev nested-require-loader
```

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

In your webpack config:

```js
module: {
  loaders: [
    {
      test: /manifest.json$/,
      loader: 'file-loader?name=manifest.json!nested-require-loader'
    }
  ]
}
```

Note that this example also uses [file-loader](https://github.com/webpack/file-loader).

For example load a [Web App Manifest](http://www.w3.org/TR/appmanifest/) through require in your application code:

```js
require('./manifest.json');
```

With each internal resource requested through require rather than just a plain path:

```js
{
  "name": "Hello World",
  ...
  "splash_screens": [
    {
      "src": "require('./images/splash-hi.png')",
      "sizes": "2560x1440",
      "type": "image/png"
    },
    ...
  ],
  "icons": [
    {
      "src": "require('./images/icon-hi.png')",
      "sizes": "512x512",
      "type": "image/png"
    },
    ...
  ]
}
```
