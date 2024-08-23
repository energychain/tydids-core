const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/TyDIDs.js',
  output: {
    filename: 'tydids.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  resolve: {
    fallback: { 
      "stream": require.resolve("stream-browserify"),
      "vm": require.resolve("vm-browserify")
     }
  },
  performance: {
    hints: false,  
  },  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};