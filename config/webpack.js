module.exports = {
  cache: true,
  devtool: 'inline-source-map',
  entry: {},
  output: {path: '/'},
  module: {
    loaders: [
      {test: /\.js$/, loader: 'webpack-espower', exclude: /node_modules/},
      {test: /\.json$/, loader: 'json'}
    ]
  }
}

