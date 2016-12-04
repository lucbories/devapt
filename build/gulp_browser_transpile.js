
'use strict'

var SRC_BROWSER_JS = 'src/browser/**/*.js'
var DST_BROWSER = 'dist/browser'



/*
    BUILD AND COPY ALL SRC/BROWSER FILES TO DIST/
        build all files
*/
const BABEL_CONFIG = {
	presets: ['es2015']
}

module.exports = function (gulp, plugins, arg_task_name)
{
	gulp.task(arg_task_name,
		() => {
			return gulp.src(SRC_BROWSER_JS)
				.pipe( plugins.changed(DST_BROWSER) )
				.pipe( plugins.sourcemaps.init() )
				.pipe( plugins.babel(BABEL_CONFIG) )
				.pipe( plugins.sourcemaps.write('.') )
				.pipe( gulp.dest(DST_BROWSER) )
		}
	)
}
