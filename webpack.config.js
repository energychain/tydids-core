const path = require('path');

module.exports = {
  entry: './src/TyDIDs.js',
  output: {
    filename: 'tydids.js',
    path: path.resolve(__dirname, 'dist'),
  },
};