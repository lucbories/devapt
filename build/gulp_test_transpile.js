
'use strict'

var SRC_TEST_JS  = 'src/test/**/*.js'
var DST_TEST  = 'dist/test'


const BABEL_CONFIG = {
	presets: ['es2015']
}


/*
	COPY ALL SRC/TEST FILES TO DIST/TEST
		build all files
*/
module.exports = function (gulp, plugins, arg_task_name)
{
	gulp.task(arg_task_name,
		() => {
			return gulp.src(SRC_TEST_JS)
				.pipe( plugins.changed(DST_TEST) )
				.pipe( plugins.sourcemaps.init() )
				.pipe( plugins.babel(BABEL_CONFIG) )
				.pipe( plugins.sourcemaps.write('.') )
				.pipe( gulp.dest(DST_TEST) )
		}
	)
}
