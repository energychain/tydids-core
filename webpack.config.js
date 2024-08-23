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
  performance: {
    hints: false,  
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      "stream": false
    }
  }
};