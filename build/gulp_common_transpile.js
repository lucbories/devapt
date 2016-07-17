
'use strict'

// var del = require('del');
// var gulp = require('gulp');
// var del = require('del');
// var sourcemaps = require('gulp-sourcemaps');
// var babel = require('gulp-babel');
// var concat = require('gulp-concat');
// var changed = require('gulp-changed');
// var browserSync = require('browser-sync').create();
// var runseq = require('run-sequence');
// var jsdoc = require('gulp-jsdoc3');

// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var browserify = require('browserify');
// var watchify = require('watchify');
// var babelify = require('babelify');
// var path = require('path')

// var path = require('path')

// var SRC_ALL_JS = 'src/**/*.js'
// var SRC_ALL_JSON = 'src/**/*.json'

var SRC_COMMON_JS  = 'src/common/**/*.js'

// var DST = 'dist'
var DST_COMMON  = 'dist/common'




const BABEL_CONFIG = {
	presets: ['es2015']
}

module.exports = function (gulp, plugins)
{
	return function ()
	{
		/*
			COPY ALL SRC/COMMON FILES TO DIST/
				build all files
		*/
		gulp.task('build_common_transpile',
			() => {
				// try
				// {
				return gulp.src(SRC_COMMON_JS)
					.pipe( plugins.changed(DST_COMMON) )
					.pipe( plugins.sourcemaps.init() )
					.pipe( plugins.babel(BABEL_CONFIG) )
					.pipe( plugins.sourcemaps.write('.') )
					.pipe( gulp.dest(DST_COMMON) )
				// }
				// catch(e)
				// {
				// 	console.log('build_common_bundle:an error occures', Object.keys(e) )
				// 	// Error: Cannot find module 'fsevents' from 'D:\DATAS\GitHub\devapt\node_modules\chokidar\lib'
				// }
				// return undefined
			}
		)
	}
}
