'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const APP_ENV = process.env.APP_ENV || 'local';

const config = {
  entry: {
    client: [
      './src/client/index.jsx',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public/bundles'),
    publicPath: '/bundles/',
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['babel-preset-env', {
                  modules: false,
                  targets: {
                    browsers: [
                      'Chrome >= 60',
                      'Safari >= 10.1',
                      'iOS >= 10.3',
                      'Firefox >= 54',
                      'Edge >= 15',
                    ],
                  },
                }],
                'babel-preset-react',
              ],
              plugins: [
                'babel-plugin-transform-decorators-legacy',
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'sass-loader',
          ],
        }),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.(png|jpg|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
    }),
  ],
  devtool: 'source-map',
  devServer: {
    inline: true,
    port: 3000,
    contentBase: 'public',
    historyApiFallback: {
      index: '/kitchen-sink.html',
    },
  },
};

// Add optimization plugins when generating the final bundle
if (APP_ENV === 'production') {
  // Turn off sourcemaps
  config.devtool = false;
  // Use minifiers
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJsPlugin({
      parallel: false,
      uglifyOptions: {
        ecma: 8,
        parse: {},
        compress: {
          unsafe: true,
          passes: 2,
        },
        output: {
          beautify: false,
          comments: false,
        },
      },
    }),
    new OptimizeCssAssetsPlugin({
      // cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true,
        },
      },
    }),
  ]);
}

module.exports = config;
