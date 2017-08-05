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
  rules: [
    {
      test: /manifest.json$/,
      use: ['file-loader?name=manifest.json', 'nested-require-loader']
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

## Options

Additional options may be applied to loader. If incorrect is specified, loader will throw an error.

|Option|Type|Default value|Description|
|---|---|---:|---|
|`rawString`|**_Boolean_**|false|Ensures that no extra quotes are added if the type of returned value is a **_string_** |

### Setting loader options

#### Object

```js
module: {
  rules: [
    {
      test: /.ext$/,
      use: [
        'other-loaders', 
        {
          loader: 'nested-require-loader',
          options: {
            rawString: false
          }
        }
      ]
    }
  ]
}
```

#### Inline

```js
module: {
  rules: [
    {
      test: /.ext$/,
      use: ['other-loaders', 'nested-require-loader?rawString=false']
    }
  ]
}
```