var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var merge = require('webpack-merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var baseConfig = require('./webpack.config.base.js');
const fs = require('fs');
const path = require('path');
const replace_css_url = require('replace-css-url');
module.exports = merge.multiple(baseConfig,[
	{
		plugins: [
			new CleanWebpackPlugin(['dist', 'build'], {
				root: __dirname,
				verbose: false,
				dry: false,
			}),
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				debug: false
			}),
			new webpack.optimize.UglifyJsPlugin({
				beautify: false,
				mangle: false,
				compress: {
					screw_ie8: true
				},
				comments: false
			})
		],
		module: {
			rules: [{
				test: /\.(js|jsx)$/,
				exclude: ['node_modules', 'dist'],
				use: ['babel-loader']
			}]
		},
		resolve: {
	        extensions: ['.js', '.jsx', '.json'],
	        modules: [
	            'node_modules'
	        ],
	       	alias: {
	       		'react' : path.resolve(__dirname, 'node_modules/react/dist/react.min.js'),
	       		'react-dom' : path.resolve(__dirname, 'node_modules/react-dom/dist/react-dom.min.js'),
	       		'react-dom/server': path.resolve(__dirname, 'node_modules/react-dom/dist/react-dom-server.min.js')
	       	}
	    }
	},
	{
		output: {
			path: path.resolve(__dirname, 'dist/assets'),
			filename: '[name]-[chunkhash].js',
			chunkFilename: '[chunkhash].js'
		},
		plugins: [
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				debug: false
			}),
			new webpack.optimize.UglifyJsPlugin({
				beautify: false,
				mangle: {
					screw_ie8: true,
					keep_fnames: true
				},
				compress: {
					screw_ie8: true
				},
				comments: false
			}),
			new CopyWebpackPlugin([
				{from: './src/ui/app/lib/js/jquery.min.js'},
				{from: './src/ui/app/lib/js/polyfill.min.js'}		
			])
		]
	},
	{
		output: {
			path: path.resolve(__dirname, 'dist/assets'),
			filename: '[name]-[chunkhash].js',
			chunkFilename: '[chunkhash].js'
		},
		plugins: [
			new webpack.LoaderOptionsPlugin({
				minimize: true,
				debug: false
			}),
			new webpack.optimize.UglifyJsPlugin({
				beautify: false,
				mangle: {
					screw_ie8: true,
					keep_fnames: true
				},
				compress: {
					screw_ie8: true
				},
				comments: false
			})
		],
		resolve: {
	        alias: {
	       		'react' : path.resolve(__dirname, 'node_modules/react/dist/react.min.js'),
	       		'react-dom' : path.resolve(__dirname, 'node_modules/react-dom/dist/react-dom.min.js'),
	       		'react-dom/server': path.resolve(__dirname, 'node_modules/react-dom/dist/react-dom-server.min.js')
	       	}
	    }
	}
]);
