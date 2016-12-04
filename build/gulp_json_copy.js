
'use strict'

var SRC_ALL_JS = 'src/**/*.js'
var SRC_ALL_JSON = 'src/**/*.json'

var DST = 'dist'


const BABEL_CONFIG = {
	presets: ['es2015']
}


/*
	COPY ALL SRC/ JSON FILES TO DIST/
		build only changed files
*/
module.exports = function (gulp, plugins, arg_task_name)
{
	gulp.task(arg_task_name,
		() => {
			return gulp.src(SRC_ALL_JSON)
				.pipe( plugins.changed(DST) )
				.pipe( gulp.dest(DST) )
		}
	)
}

