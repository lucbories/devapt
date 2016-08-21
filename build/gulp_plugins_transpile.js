
'use strict'

var SRC_PLUGINS_JS  = 'src/plugins/**/*.js'

var DST_PLUGINS  = 'dist/plugins'




const BABEL_CONFIG = {
	presets: ['es2015']
}

module.exports = function (gulp, plugins)
{
	return function (arg_task_name)
	{
		/*
			COPY ALL SRC/PLUGINS FILES TO DIST/
				build all files
		*/
		gulp.task(arg_task_name,
			() => {
				return gulp.src(SRC_PLUGINS_JS)
					.pipe( plugins.changed(DST_PLUGINS) )
					.pipe( plugins.sourcemaps.init() )
					.pipe( plugins.babel(BABEL_CONFIG) )
					.pipe( plugins.sourcemaps.write('.') )
					.pipe( gulp.dest(DST_PLUGINS) )
			}
		)
	}
}
