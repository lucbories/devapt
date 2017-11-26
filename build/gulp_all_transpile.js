
'use strict'

var SRC_ALL_JS = 'src/**/*.js'
var DST = 'dist'


const BABEL_CONFIG = {
	presets: ['es2015']
}


/*
	BUILD ALL SRC/ JS FILES TO DIST/
		with sourcemap files
		build only changed files
*/
module.exports = function (gulp, plugins)
{
	gulp.task('build_all_transpile',
		() => {
			return gulp.src(SRC_ALL_JS)
				.pipe( plugins.changed(DST) )
				.pipe( plugins.sourcemaps.init() )
				.pipe( plugins.babel(BABEL_CONFIG) )
				.pipe( plugins.sourcemaps.write('.') )
				.pipe( gulp.dest(DST) )
		}
	)
}

