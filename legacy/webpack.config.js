var webpack = require('webpack');
var path = require('path')


var node_dir = "c:\program files (x86)\nodejs"

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './server/server.js'
  ],
  
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  },
  
  resolve: {
    extensions: ['', '.js', '.jsx'],
    fallback: path.join(__dirname, "node_modules"),
    modulesDirectories: [path.join(__dirname, "node_modules"), path.join(node_dir, "node_modules")]
  },
  
  resolveLoader: {
    extensions: ['.js'],
    fallback: path.join(__dirname, "node_modules"),
    modulesDirectories: [path.join(__dirname, "node_modules"), path.join(node_dir, "node_modules")]
  },
  
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'devapt_bundle.js'
  },
  
  devServer: {
    contentBase: './dist',
    hot: true
  },
  
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};