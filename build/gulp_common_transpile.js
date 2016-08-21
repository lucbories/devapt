
'use strict'

var SRC_COMMON_JS  = 'src/common/**/*.js'

var DST_COMMON  = 'dist/common'



const BABEL_CONFIG = {
	presets: ['es2015']
}

module.exports = function (gulp, plugins)
{
	return function (arg_task_name)
	{
		/*
			COPY ALL SRC/COMMON FILES TO DIST/COMMON
				build all files
		*/
		gulp.task(arg_task_name,
			() => {
				return gulp.src(SRC_COMMON_JS)
					.pipe( plugins.changed(DST_COMMON) )
					.pipe( plugins.sourcemaps.init() )
					.pipe( plugins.babel(BABEL_CONFIG) )
					.pipe( plugins.sourcemaps.write('.') )
					.pipe( gulp.dest(DST_COMMON) )
			}
		)
	}
}
