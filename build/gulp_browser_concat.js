
'use strict'

var DST_BROWSER = 'dist/browser'
var DST_BROWSER_JS = 'dist/browser/**/*.js'
var DST_BROWSER_CONCAT = 'devapt-concat.js'



/*
    BUILD AND COPY ALL SRC/BROWSER FILES TO DIST/
        build all files
*/
module.exports = function (gulp, plugins)
{
	return function (arg_task_name)
	{
		gulp.task(arg_task_name,
			() => {
				return gulp.src(DST_BROWSER_JS)
					// .pipe( plugins.changed(DST) )
					.pipe( plugins.concat(DST_BROWSER_CONCAT) )
					.pipe( plugins.sourcemaps.init() )
					.pipe( plugins.sourcemaps.write('.') )
					.pipe( gulp.dest(DST_BROWSER) )
			}
		)
	}
}
