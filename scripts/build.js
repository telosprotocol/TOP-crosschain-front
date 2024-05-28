const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config/webpack.conf');

const compiler = webpack(config);

console.log('Start production build...');

compiler.run((err, stats) => {
  if (err) {
    console.log(chalk.red(err.stack || err));
    if (err.details) {
      console.log(chalk.red(err.details));
    }
    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.log(chalk.red(info.errors));
    return;
  }

  console.log(chalk.green('Compiled successfully.\n'));
});
