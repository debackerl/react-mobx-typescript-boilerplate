var webpack = require('webpack');
var path = require('path');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

// variables
var isProduction = process.argv.indexOf('-p') >= 0;
var sourcePath = path.join(__dirname, './src');
var outPath = path.join(__dirname, './dist');

// Documentation: https://webpack.js.org/configuration/

module.exports = {
  context: sourcePath,
  entry: {
    main: './main.tsx' // all entry points used by app, typically one per 'start' page
  },
  output: {
    path: outPath,
    filename: 'runtime.js', // sync chunk
    chunkFilename: '[name]-[chunkhash].js', // async chunk
    publicPath: '/' // public path of app as seen by browser
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'], // extensions used for module resolution
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      'app': path.resolve(__dirname, 'src/app/')
    }
  },
  module: {
    rules: [
      // .ts, .tsx linting
      {
        test: /\.tsx?$/,
        use: 'tslint-loader',
        enforce: 'pre',
        exclude: /node_modules/
      },
      // .ts, .tsx
      {
        test: /\.tsx?$/,
        use: isProduction
          ? 'ts-loader'
          : ['babel-loader?plugins=react-hot-loader/babel', 'ts-loader']
      },
      // css from modules
      {
        test: /node_modules.*\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      // css from app
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              // resolve css files from source code
              loader: 'css-loader',
              query: {
                modules: true, // module mode to use CSS files as modules
                sourceMap: !isProduction, // generate source map when not production
                importLoaders: 1, // number of CSS loaders to apply before this one (postcss-loader, defined below)
                localIdentName: '[local]__[hash:base64:5]' // pattern of generated class names
              }
            },
            {
              // add features to css using post-processor
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-import')({ addDependencyTo: webpack }), // allow imports
                  require('postcss-url')(), // allow import of urls
                  require('postcss-cssnext')(),
                  require('postcss-reporter')(),
                  require('postcss-browser-reporter')({
                    disabled: isProduction
                  })
                ]
              }
            }
          ]
        })
      },
      // static assets
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.png$/, use: 'url-loader?limit=10000' },
      { test: /\.jpg$/, use: 'file-loader' }
    ]
  },
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        // chunk containing app modules referenced by at least two other chunks
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        // create vendors chunck containing librairies
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new ExtractTextPlugin({
      filename: 'styles.css',
      disable: !isProduction
    }),
    new HtmlWebpackPlugin({
      template: 'assets/index.html'
    })
  ],
  devServer: {
    contentBase: sourcePath, // location of files to be served
    hot: true,
    inline: true, // code inserted in app for hot reloading
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal' // show errors and new compilation events
  },
  devtool: isProduction
    ? 'source-map' // create source map file appart, with reference in comments
    : 'cheap-module-eval-source-map', // inline source map
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
