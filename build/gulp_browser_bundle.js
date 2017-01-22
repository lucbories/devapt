
'use strict'

var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var gutil = require('gulp-util');
var browserify = require('browserify')

var DST = 'dist'
var DST_BROWSER_INDEX = './dist/browser/index.js'
var DST_BROWSER_BUNDLE = 'devapt-browser.js'

const browserify_settings = {
	entries: [DST_BROWSER_INDEX]
}



/*
    BUILD AND COPY ALL SRC/BROWSER FILES TO DIST/
        build all files
*/
module.exports = function (gulp, plugins, arg_task_name)
{
	var bundler = browserify(browserify_settings)
	// bundler.transform(
	// 	{
	// 		global: true
	// 	},
	// 	'uglifyify'
	// )

	gulp.task(arg_task_name, bundle)

	function bundle() {
		bundler
			.ignore('sequelize')
			.ignore('restify')
			.ignore('winston')
			.ignore('passport')
			.ignore('socket.io')
			.ignore('node-forge')
			.require('./dist/browser/runtime/client_runtime.js', { expose:'client_runtime' } )
			.require('./dist/browser/index.js', { expose:'devapt' } )
			.require('./public/js/forge.min.js', { expose:'forge-browser' } )
		
		var stream = bundler.bundle()
			.on('error', gutil.log.bind(gutil, 'Browserify Error'))
			.on('error',
				function(err)
				{
					console.error(err)
					this.emit('end')
				}
			)
			.pipe( source(DST_BROWSER_BUNDLE) )
			// .pipe( plugins.changed(DST) )
			.pipe( new buffer() )
			.pipe( plugins.sourcemaps.init() )
			.pipe( plugins.sourcemaps.write('.') )
			.pipe( gulp.dest(DST) )
			.pipe( plugins.livereload() )
		
		return stream
	}
}
