const path = require('path');
const env = require('./env');

module.exports = {
  publicPath: env.NODE_ENV === 'development' ? '/' : '/',
  buildPath: path.resolve(__dirname, '../dist'),
  srcPath: path.resolve(__dirname, '../src'),
  htmlPath: path.resolve(__dirname, '../src/index.html'),
  tsLintPath: path.resolve(__dirname, '..', 'tslint.json'),
  tsPath: path.resolve(__dirname, '..', 'tsconfig.json'),
};
