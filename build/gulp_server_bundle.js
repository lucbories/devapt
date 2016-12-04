
'use strict'

var DST = 'dist'
var DST_SERVER_JS  = 'dist/server/**/*.js'



module.exports = function (gulp, plugins, arg_task_name)
{
	gulp.task(arg_task_name,
		() => {
			return gulp.src(DST_SERVER_JS)
				.pipe( plugins.concat('devapt-server.js') )
				.pipe( plugins.sourcemaps.init() )
				.pipe( plugins.sourcemaps.write('.') )
				.pipe( gulp.dest(DST) )
		}
	)
}

