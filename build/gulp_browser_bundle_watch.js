
'use strict'

var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var watchify = require('watchify')
var assign = require('lodash').assign
var path = require('path')


var DST = 'public/assets/build'
var DST_BROWSER_INDEX = './dist/browser/index.js'
var DST_BROWSER_BUNDLE = 'devapt-browser.js'
var DST_FILENAME = path.join(__dirname, '../', DST_BROWSER_INDEX)

const browserify_settings = {
	entries: [DST_FILENAME],
	debug: true,
	cache: {},
	packageCache: {},
	fullPaths: true
}
var opts = assign({}, watchify.args, browserify_settings);



/*
    BUILD AND COPY ALL SRC/BROWSER FILES TO DIST/
        build all files
*/
module.exports = function (gulp, plugins, arg_task_name)
{
	gulp.task(arg_task_name, bundle)
	
	var bundler = watchify( browserify(opts) )
	
	bundler
		.ignore('sequelize')
		.ignore('restify')
		.ignore('socket.io')
		.ignore('node-forge')
		.require('./dist/browser/runtime/client_runtime.js', { expose:'client_runtime' } )
		.require('./public/js/forge.min.js', { expose:'forge-browser' } )


	bundler.on('update', bundle); // on any dep update, runs the bundler
	bundler.on('log', plugins.util.log); // output build logs to terminal
	
	function bundle() {
		console.log('A browser file was changed, running task [%s]', arg_task_name)

		// bundler
		// 	.ignore('sequelize')
		// 	.ignore('restify')
		// 	.ignore('socket.io')
		// 	.ignore('node-forge')
		// 	.require('./dist/browser/client_runtime.js', { expose:'client_runtime' } )
		// 	.require('./public/js/forge.min.js', { expose:'forge-browser' } )
		
		var stream = bundler.bundle()
			.on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
			.on('error',
				function(err)
				{
					console.error(err)
					this.emit('end')
				}
			)
			.pipe( source(DST_BROWSER_BUNDLE) )
			.pipe( new buffer() )
			.pipe( plugins.sourcemaps.init() )
			.pipe( plugins.sourcemaps.write('.') )
			.pipe( gulp.dest(DST) )
			// .pipe( plugins.livereload() )
		
		return stream
	}
}
