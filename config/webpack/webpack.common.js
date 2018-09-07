var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var helpers = require('../helpers');

//var extractLib = new ExtractTextPlugin("lib.css");

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  resolveLoader: {
    moduleExtensions: ['-loader']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: helpers.root('src', 'tsconfig.json')
            }
          },
          'angular2-template-loader',
          'angular-router-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: ['raw-loader']
        
      },
      {
        test: /\.css$/,
        //include: helpers.root('src', 'app'),
        //include: /app/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: 'css-loader?sourceMap'
          })
      },
      {
        test: /\.scss$/i,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
            // use: [{
            //   loader: "css-to-string-loader" // creates style nodes from JS strings
            // },{
            //   loader: "style-loader" // creates style nodes from JS strings
            // }, {
            //   loader: "css-loader" // translates CSS into CommonJS
            // }, {
            //   loader: "sass-loader" // compiles Sass to CSS
            // }]
          })
      }

      //for bootstrap
      // { 
      //   test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
      //   loader: "file" 
      // },
      // { 
      //   test: /\.(woff|woff2)$/, 
      //   loader:"url?prefix=font/&limit=5000" 
      // },
      // { 
      //   test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
      //   loader: "url?limit=10000&mimetype=application/octet-stream" 
      // },
      // { 
      //   test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
      //   loader: "url?limit=10000&mimetype=image/svg+xml" 
      // },

      //for font-awesome
      // {
      //   test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      //   loader: "url?limit=10000&mimetype=application/font-woff"
      // }, 
      // {
      //   test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      //   loader: "url?limit=10000&mimetype=application/font-woff"
      // }, 
      // {
      //   test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      //   loader: "url?limit=10000&mimetype=application/octet-stream"
      // }, 
      // {
      //   test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      //   loader: "file"
      // }, 
      // {
      //   test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      //   loader: "url?limit=10000&mimetype=image/svg+xml"
      // }
    ]
  },

  plugins: [
    //for angualr 5
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(@angular|esm5)/,
      helpers.root('./src')
    ),

    //for angualr 4
    // Workaround for angular/angular#11580 
    // new webpack.ContextReplacementPlugin(
    //   // The (\\|\/) piece accounts for path separators in *nix and Windows
    //   /angular(\\|\/)core(\\|\/)@angular/,
    //   helpers.root('./src'), // location of your src
    //   {} // a map of your routes
    // ),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),

    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),

    new CopyWebpackPlugin([
        {from:'web.config',to:'web.config', toType: 'file'} 
    ]), 

    new CopyWebpackPlugin([
        {from:'./src/assets/images/favicon.ico',to:'favicon.ico', toType: 'file'} 
    ])
  ]
};

