module.exports = {
  entry: {
    main: __dirname + '/index.js'
  },

  output: {
    filename: 'index.js',
    path: __dirname + '/actual-output'
  },

  module: {
    rules: [
      {
        test: /manifest.json$/,
        use: ['file-loader?name=manifest.json', './index.js?rawString=true']
      },
    ]
  }
};
