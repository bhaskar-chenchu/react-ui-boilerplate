function exclude() {
	return null;
}

require('babel-core/register')({
	ignore: [/node_modules\/(?!common-ui)/, 'dist']
}); 

require.extensions['.css'] = exclude;
