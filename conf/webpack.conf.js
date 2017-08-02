const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [
          {
            loader: 'json-loader'
          }
        ]
      },
      { // TODO - this object doesn't seem to do shit
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'tslint-loader',
        enforce: 'pre',
        options: {
          // so you can format like this or with loader objects
        }
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                // sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sourceMapFilename: '[file].map'
              }
            },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    FailPlugin,
    new HtmlWebpackPlugin({
      css: 'styles.css',
      template: conf.path.src('index.html')
    }),
    new webpack.ContextReplacementPlugin(
      // /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      /angular(\\|\/)core(\\|\/)@angular/,
      conf.paths.src
    ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev') // need to wrap strings with stringify
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [autoprefixer],
        resolve: {},
        ts: {
          configFileName: 'tsconfig.json'
        },
        tslint: {
          configuration: require('../tslint.json')
        }
      },
      debug: true
    }),
    // extract styles into separate doc to load separately from js lifecycle
    new ExtractTextPlugin('styles.css')
  ],
  devtool: 'source-map',
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: 'index.js'
  },
  resolve: {
    extensions: [
      '.webpack.js',
      '.web.js',
      '.js',
      '.ts'
    ]
  },
  entry: `./${conf.path.src('index')}`
};
