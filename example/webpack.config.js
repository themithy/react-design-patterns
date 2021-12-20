
const path = require('path')
const webpack = require('webpack')
const html = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [
          path.resolve(__dirname),
        ]
      }
    ]
  },
  resolve: {
    modules: [ 'src', 'node_modules' ],
    extensions: [ '.js' ],
  },
  plugins: [
    new html({
      meta: {
        charset: 'utf-8',
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
  }
};

