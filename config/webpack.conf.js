const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const ForkTsChecker = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const env = require('./env');
const paths = require('./paths');

const isDev = env.NODE_ENV === 'development';

const cssLoader = [
  { loader: isDev ? 'style-loader' : MiniCssExtractPlugin.loader },
  // {
  //   loader: 'px2vw-view-loader',
  //   query: {
  //     viewportWidth: 375,
  //     viewportUnit: 'vw',
  //     minPixelValue: 1,
  //     decimal: 6,
  //   },
  // },
  { loader: 'css-loader' },
  ...(isDev ? [] : [{ loader: 'postcss-loader' }]),
];

function getPlugins() {
  const _plugins = [
    new HtmlWebpackPlugin({
      template: paths.htmlPath,
      filename: 'index.html',
      title: '',
      inject: true,
      minify: !isDev,
    }),
    new webpack.optimize.SplitChunksPlugin(),
    new ForkTsChecker({
      async: false,
      checkSyntacticErrors: true,
      watch: paths.srcPath,
      tsconfig: paths.tsPath,
      tslint: paths.tsLintPath,
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    }),
  ];
  const prodPlugins = [
    require('autoprefixer'),
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, '../'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css',
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(paths.buildPath, 'static'),
      },
    ]),
  ];
  const devPlugins = [
    new AutoDllPlugin({
      debug: isDev,
      // will inject the DLL bundle to index.html
      // default false
      inject: true,
      filename: '[name].[hash].js',
      path: 'vendor',
      entry: {
        vendor: Object.keys(require('../package.json').dependencies),
      },
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here: http:localhost:${env.PORT}`,
        ],
      },
      clearConsole: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ];

  return isDev ? _plugins.concat(devPlugins) : _plugins.concat(prodPlugins);
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: isDev
    ? [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        path.resolve(paths.srcPath, 'index.tsx'),
      ]
    : path.resolve(paths.srcPath, 'index.tsx'),
  output: {
    path: paths.buildPath,
    filename: 'js/[name].[hash].js',
    publicPath: paths.publicPath,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [],
          }),
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpg|jfif|jpeg|gif|m4a)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[hash:8].[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'font/[hash:8].[name].[ext]',
            },
          },
        ],
      },
      {
        // css
        test: /\.css$/,
        use: cssLoader,
      },
      {
        // scss sass
        test: /\.s(c|a)ss$/,
        use: [
          ...cssLoader,
          {
            loader: 'sass-loader',
            options: { implementation: require('sass') },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                // path.resolve(__dirname, '../src/assets/styles/_variables.scss'),
              ],
            },
          },
        ],
      },
      {
        // less
        test: /\.less$/,
        use: [
          ...cssLoader,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: require('../package.json').theme,
                javascriptEnabled: true,
              },
            },
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                path.resolve(__dirname, '../src/assets/styles/_variables.less'),
                path.resolve(__dirname, '../src/assets/styles/_mixins.less'),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: getPlugins(),
  resolve: {
    alias: {
      '@': paths.srcPath,
    },
    extensions: ['*', '.js', '.json', '.ts', '.tsx'],
  },
  optimization: isDev
    ? undefined
    : {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendors: {
              chunks: 'all',
              test: /[\\/]node_modules[\\/](web3|react|react-dom|react-router-dom|react-loadable|nprogress|mobx-react-router|mobx-react|mobx|moment)/,
              priority: 100,
              name: 'vendors',
            },
            commons: {
              chunks: 'all',
              minChunks: 2,
              name: 'commons',
              priority: 80,
            },
          },
        },
      },
};
