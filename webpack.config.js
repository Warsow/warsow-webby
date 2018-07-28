'use strict';

const webpack = require('webpack');
const path = require('path');
const BuildNotifierPlugin = require('webpack-build-notifier');

const NODE_ENV = process.env.NODE_ENV || 'local';

const config = {
  mode: 'none',
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
  resolve: {
    extensions: ['.mjs', '.js', '.jsx'],
    alias: {
      // Trick Semantic UI into picking up our provided theme
      '../../theme.config$': path.join(__dirname, 'src/client/styles/semantic/theme.config'),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  modules: false,
                  useBuiltIns: 'usage',
                  // targets: {
                  //   browsers: [
                  //     'Chrome >= 60',
                  //     'Safari >= 10.1',
                  //     'iOS >= 10.3',
                  //     'Firefox >= 54',
                  //     'Edge >= 15',
                  //   ],
                  // },
                }],
                '@babel/preset-react',
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', {
                  legacy: true,
                }],
                '@babel/plugin-proposal-class-properties',
              ],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
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
    new BuildNotifierPlugin(),
  ],
  devtool: 'source-map',
  devServer: {
    // Mandatory settings
    port: 3000,
    publicPath: '/bundles/',
    contentBase: 'public',
    historyApiFallback: {
      index: '/index.html',
    },
    // Informational flags
    progress: false,
    quiet: false,
    noInfo: false,
    // Fine-grained logging control
    stats: {
      assets: false,
      builtAt: false,
      cached: false,
      children: false,
      chunks: false,
      colors: true,
      hash: false,
      timings: false,
      version: false,
      modules: false,
    },
  },
};

// Add optimization plugins when generating the final bundle
if (NODE_ENV === 'production') {
  const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
  config.devtool = false;
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
        parse: {},
        compress: {
          inline: false, // Workaround, see: https://github.com/mishoo/UglifyJS2/issues/2842
          passes: 2,
        },
        output: {
          beautify: false,
          comments: false,
        },
      },
    }),
  ]);
}

module.exports = config;
