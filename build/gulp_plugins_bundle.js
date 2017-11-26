
'use strict'


var DST = 'dist'
var DST_PLUGINS_JS  = 'dist/plugins/**/*.js'



module.exports = function (gulp, plugins, arg_task_name)
{
	gulp.task(arg_task_name,
		() => {
			return gulp.src(DST_PLUGINS_JS)
				// .pipe( plugins.changed(DST_PLUGINS_JS) )
				.pipe( plugins.concat('devapt-plugins.js') )
				.pipe( plugins.sourcemaps.init() )
				.pipe( plugins.sourcemaps.write('.') )
				.pipe( gulp.dest(DST) )
		}
	)
}

