var webpack = require('webpack');
var path = require('path');

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
// TODO: migrate to https://github.com/webpack-contrib/mini-css-extract-plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
//var ZopfliPlugin = require('zopfli-webpack-plugin');

// variables
var sourcePath = path.join(__dirname, './src');
var clientOutPath = path.join(__dirname, './dist');
var serverOutPath = __dirname;

// Documentation: https://webpack.js.org/configuration/

// production mode will set process.env.NODE_ENV to 'production' in app,
// otherwise it will be 'development'.

// TODO:
// server build needs postcss module logic to get class names,
// however, the output of postcss must be processed by extract text or mini css,
// which is writing CSS to a file. This is to avoid using style-loader, which
// doesn't work on server side. Problem is that client build is also building
// CSS file.

// TODO:
// The TypeScript code is built twice, once for server, once for client.
// TypeScript 3.0 has added support for shared code. Maybe we can precompile
// the app as a TypeScript library. Then use Webpack to create bundles.

module.exports = (env, argv) => {
  var isProduction = argv.mode === 'production';

  const common = {
    context: sourcePath,
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.mdx', '.css'], // extensions used for module resolution
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
        // .mdx
        // Loader converting Markdown files to React components.
        // Generated code is ES2015 to be converted by Babel.
        // For use to write text pages only, no static typing is performed.
        // Intro: http://jamesknelson.com/introducing-mdxc/
        // Manual: https://github.com/jamesknelson/mdxc
        // Syntax: http://mdxc.reactarmory.com/examples/basics/
        {
          test: /\.mdx?$/,
          use: isProduction
            ? ['babel-loader', 'mdx-loader']
            : ['babel-loader?plugins=react-hot-loader/babel', 'mdx-loader']
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
                // resolve css files from source code,
                // and creates .d.ts file next to each imported css file
                loader: 'typings-for-css-modules-loader',
                query: {
                  namedExport: true, // export only class names valid in JavaScript
                  camelCase: true, // convert class names to valid names in JavaScript
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
    }
  };

  const client = Object.assign({}, common, {
    name: 'client',
    target: 'web',
    entry: {
      main: './client.tsx' // all entry points used by app, typically one per 'start' page
    },
    output: {
      path: clientOutPath,
      filename: 'runtime.js', // sync chunk
      chunkFilename: '[name]-[chunkhash].js', // async chunk
      publicPath: '/dist' // public path of app as seen by browser
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
      minimizer: isProduction ? [
        new UglifyJsPlugin({
          cache: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ] : [],
      runtimeChunk: true
    },
    plugins: [
      new WebpackCleanupPlugin(),
      // https://medium.com/@mattvagni/server-side-rendering-with-css-modules-6b02f1238eb1
      new ExtractTextPlugin({
        filename: '[name]-[chunkhash].css',
        disable: !isProduction // when disable = true, then style-loader is used as fallback
      }),
      new HtmlWebpackPlugin({
        template: 'assets/index.html'
      }),
      new webpack.WatchIgnorePlugin([
        // ignore CSS type files for HOT mode
        /\.(c|sa|sc|le)ss\.d\.ts$/
      ]),
      /*new ZopfliPlugin({
        asset: "[path].gz[query]",
        algorithm: "zopfli",
        test: /\.(css|js|html)$/,
        threshold: 4096,
        minRatio: 0.8
      })*/
    ],
    devServer: {
      contentBase: sourcePath, // ./src/assets available as /assets
      historyApiFallback: {
        disableDotRule: true,
        index: '/dist/index.html',
        /*rewrite: [
          // for use with multiple SPAs:
          { from: /./, to: '/dist/index.html' }
        ]*/
      },
      hot: true, // hot module replacement, requires HotModuleReplacementPlugin or --hot
      inline: true, // code inserted in app for hot reloading
      stats: 'minimal' // show errors and new compilation events
    },
    devtool: isProduction
      ? false
      : 'cheap-module-eval-source-map' // inline source map
  });

  const server = Object.assign({}, common, {
    name: 'server',
    target: 'node', // won't touch native dependencies such as fs or path
    entry: './server.tsx',
    output: {
      path: serverOutPath,
      filename: 'server.js',
      libraryTarget: 'commonjs'
    },
    externals: [
      nodeExternals({
        modulesFromFile: true, // all modules from package.json are external
        whitelist: [ /\.css$/ ] // we don't consider css files from modules for import at run-time
      })
    ],
    plugins: [
      new ExtractTextPlugin({
        // TODO: useless, need a way to skip it
        filename: './server.css',
        disable: false
      }),
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false,
        include: /\.js$/
      })
    ],
    devtool: 'nosources-source-map'
  });

  return [ client, server ];
};
