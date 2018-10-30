var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var nodeExternals = require('webpack-node-externals');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');

const mobileCSS = new ExtractTextPlugin({ filename: 'mobile.css', disable: false, allChunks: true });
const desktopCSS = new ExtractTextPlugin({ filename: 'desktop.css', disable: false, allChunks: true });
const tabletCSS = new ExtractTextPlugin({ filename: 'tablet.css', disable: false, allChunks: true });
const commonCSS = new ExtractTextPlugin({ filename: 'common.css', disable: false, allChunks: true });

module.exports = [
	{
		context: __dirname,
	    entry: {
	        server_bundle: './src/ui/app/ServerEntry.js'
	    },
	    output: {
	        path: path.resolve(__dirname, 'dist'),
	        filename: 'server-bundle.js'
	    },
		externals: [nodeExternals({modulesFromFile:true})],
		target: 'node',
	    node: {
	        console: false,
	        global: false,
	        process: false,
	        Buffer: false,
	        __filename: true,
	        __dirname: true
	    },
		plugins: [
	        new ExtractTextPlugin({ filename: 'do_not_use.css', disable: false, allChunks: true })
	    ],
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						use: ['css-loader']
					})
				}
			]
		}
	},
	{
		entry: {
			do_not_use: [
				'./src/ui/app/ClientEntry.js'
			]
	    },
		plugins: [
	        mobileCSS,
	        desktopCSS,
	        tabletCSS,
	        commonCSS,
			new OptimizeCssAssetsPlugin({
		      	assetNameRegExp: /\.css$/g,
		      	cssProcessor: require('cssnano'),
		      	cssProcessorOptions: { discardComments: {removeAll: true } },
		      	canPrint: true
		    })
		],
		resolve: {
	        extensions: ['.js', '.jsx', '.json'],
	        modules: [
	            'node_modules'
	        ]
	    },
	    node: { fs: 'empty' },
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: [
						/dist/
					],
					use: ['babel-loader']
				},
				{
					test: /\-m.css$/,
					use: mobileCSS.extract({
						use: ['css-loader']
					})
				},
				{
					test: /\-d.css$/,
					use: desktopCSS.extract({
						use: ['css-loader']
					})
				},
				{
					test: /\-t.css$/,
					use: tabletCSS.extract({
						use: ['css-loader']
					})
				},
				{
					test: /\-common.css$/,
					use: commonCSS.extract({
						use: ['css-loader']
					})
				}
			]
		}
	},
	{
		entry: {
			client_bundle: [
				'./src/ui/app/ClientEntry.js'
			]
		},
		plugins: [
			new WebpackMd5Hash(),
			new ManifestPlugin(),
			new ExtractTextPlugin({ filename: 'do_not_use.css', disable: false, allChunks: true })
		],
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: [
						/dist/
					],
					use: ['babel-loader']
				},
				{
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						use: ['css-loader']
					})
				}
			]
		},
		resolve: {
	        extensions: ['.js', '.jsx', '.json'],
	        modules: [
	            'node_modules'
	        ]
	    }
	}
];
