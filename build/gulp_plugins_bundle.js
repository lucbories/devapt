
'use strict'


var DST = 'dist'
var DST_PLUGINS_JS  = 'dist/plugins/**/*.js'



module.exports = function (gulp, plugins)
{
	return function ()
	{
		gulp.task('build_plugins_bundle',
			() => {
				return gulp.src(DST_PLUGINS_JS)
					.pipe( plugins.concat('devapt-plugins.js') )
					.pipe( plugins.sourcemaps.init() )
					.pipe( plugins.sourcemaps.write('.') )
					.pipe( gulp.dest(DST) )
			}
		)
	}
}

