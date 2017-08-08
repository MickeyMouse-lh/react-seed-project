var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../')
module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'static': path.resolve(__dirname, '../static'),
      'less': path.resolve(__dirname, '../src/assets/less'),
      'icon': path.resolve(__dirname, '../src/assets/icon'),
      'lib': path.resolve(__dirname, '../src/lib'),
      'reducers': path.resolve(__dirname, '../src/redux/reducers'),
      'actions': path.resolve(__dirname, '../src/redux/actions'),
      'state': path.resolve(__dirname, '../src/redux/state'),
      'components': path.resolve(__dirname, '../src/components'),
      'fetchActions': path.resolve(__dirname, '../src/redux/fetchActions')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'webpack-zepto'
    })
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loader: [
      {
        test: /\.less$/,
        exclude: /^node_modules$/,
        loader: "style!css!less"
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel', exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['transform-runtime', 'transform-decorators-legacy']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  }
}
