var config = {
	port: {
		client: 3000
	},

	root: 'client/dist',

	staticIndex: 'client/dist/index.html',

	js: {
		appMain: 'client/app/app.init.jsx',
		watch: [
			'client/app/app.init.jsx',
			'client/app/app.routes.jsx',
			'client/app/**/**/*.jsx',
			'client/app/**/**/*.js'
		],
		extensions: [
			'.jsx',
			'.js'
		],
		presets: [
			"es2015",
			"react"
		],
		outputName: 'bundle.js',
		dest: 'client/dist/src/js',
		deps: [
			'react',
			'react-dom'
		]
	},

	copy: {
		index: {
			src: 'client/index.html',
			dest: 'client/dist'
		},

		js: {
			src: 'client/assets/javascripts/**',
			dest: 'client/dist/src/js'
		},

		css: {
			src: 'client/assets/stylesheets/**',
			dest: 'client/dist/src/css'
		},

		img: {
			src: 'client/assets/images/**',
			dest: 'client/dist/src/img'
		},

		fonts: {
			src: 'client/assets/fonts/**',
			dest: 'client/dist/src/fonts'
		}
	}
};

module.exports = config;