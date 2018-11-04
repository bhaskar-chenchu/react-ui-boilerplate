//Used only in local development environment
var merge = require('webpack-merge');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var baseConfig = require('./webpack.config.base.js');
const fs = require('fs');
const path = require('path');
const replace_css_url = require('replace-css-url');
module.exports = merge.multiple(baseConfig, [
	{
		module: {
			rules: [{
				test: /\.(js|jsx)$/,
				exclude: ['node_modules', 'dist'],
				use: ['babel-loader']
			}]
		}
	},
	{
		output: {
			path: path.resolve(__dirname, 'dist/assets'),
			filename: '[name].js'
		},
		plugins: [
			new CopyWebpackPlugin([
				{from: './src/ui/app/lib/js/jquery.min.js'},
				{from: './src/ui/app/lib/js/polyfill.min.js'}		
	        ])
		]
	},
	{
		output: {
			path: path.resolve(__dirname, 'dist/assets'),
			filename: '[name].js'
		}
	}
]);
