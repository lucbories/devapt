
'use strict'


var DST = 'dist'
var DST_COMMON_JS  = 'dist/common/**/*.js'



module.exports = function (gulp, plugins, arg_task_name)
{
	gulp.task(arg_task_name,
		() => {
			return gulp.src(DST_COMMON_JS)
				// .pipe( plugins.changed(DST_COMMON_JS) )
				.pipe( plugins.concat('devapt-common.js') )
				.pipe( plugins.sourcemaps.init() )
				.pipe( plugins.sourcemaps.write('.') )
				.pipe( gulp.dest(DST) )
		}
	)
}

