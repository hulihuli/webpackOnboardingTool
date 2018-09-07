var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('../helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    //devtool: 'source-map',
    devtool: 'cheap-module-eval-source-map',

    //[name]对应entry对象键名,也可以指定名字,加上id和hash可以避免缓存问题,webpack会用实际值替换类似[hash]这样字符串
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        //publicPath: "http://localhost:8080/",
        //filename: '[name].[hash].js',
        filename: '[name].js',
        //The key point here was to remove the file extensions from ExtractTextPlugin() and output{} and then adding them to entry{}, otherwise webpack would generate a JS file for each CSS file
        //filename: '[name]',
        chunkFilename: '[id].[hash].chunk.js'
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
            mangle: {
                keep_fnames: true
            },
            //sourceMap: true
        }),
        //new ExtractTextPlugin('[name].[hash].css'),
        new ExtractTextPlugin('[name].css'),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        })
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }

});

