
'use strict'

var SRC_SERVER  = 'src/server/**/*.js'
var DST_SERVER  = 'dist/server'



const BABEL_CONFIG = {
	presets: ['es2015']
}

/*
	COPY ALL SRC/SERVER FILES TO DIST/
		build all files
*/
module.exports = function (gulp, plugins, arg_task_name)
{
	gulp.task(arg_task_name,
		() => {
			return gulp.src(SRC_SERVER)
				.pipe( plugins.changed(DST_SERVER) )
				.pipe( plugins.sourcemaps.init() )
				.pipe( plugins.babel(BABEL_CONFIG) )
				.pipe( plugins.sourcemaps.write('.') )
				.pipe( gulp.dest(DST_SERVER) )
		}
	)
}

