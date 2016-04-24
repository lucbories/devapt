
'use strict'

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');


var DST = 'dist'
var DST_BROWSER_INDEX = 'dist/browser/index.js'
var DST_BROWSER_BUNDLE = 'devapt-browser.js'


/*
    BUILD AND COPY ALL SRC/BROWSER FILES TO DIST/
        build all files
*/
module.exports = function (gulp, plugins)
{
	return function ()
	{
		gulp.task('build_browser_bundle',
			() => {
				const browserify_settings = {
					entries: [DST_BROWSER_INDEX]
				}
				var bundler = browserify(browserify_settings)
					.ignore('sequelize')
					.ignore('restify')
					.ignore('socket.io')
					.require('./dist/browser/client_runtime.js', { expose:'client_runtime' } )
				
				try
				{
					var stream = bundler.bundle()
						.on('error',
							function(err)
							{
								console.error(err)
								this.emit('end')
							}
						)
						.pipe( source(DST_BROWSER_BUNDLE) )
						.pipe( buffer() )
						.pipe( plugins.sourcemaps.init() )
						.pipe( plugins.sourcemaps.write('.') )
						.pipe( gulp.dest(DST) )
						.pipe( plugins.livereload() )
					return stream
				}
				catch(e)
				{
					console.log('build_browser_bundle:an error occures', Object.keys(e) )
					// Error: Cannot find module 'fsevents' from 'D:\DATAS\GitHub\devapt\node_modules\chokidar\lib'
				}
				
				return undefined
			}
		)
	}
}
