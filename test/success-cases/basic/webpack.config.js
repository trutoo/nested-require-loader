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
        use: [
          'file-loader?name=manifest.json',
          {
            loader: './index.js',
            options:{
              rawString: false
            }
          }
        ]
      },
      {
        test: /.gif$/,
        use: 'file-loader?name=[name].[ext]'
      }
    ]
  }
};
