
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

// var SRC_COMMON  = 'src/common/**/*.js'
// var SRC_SERVER  = 'src/server/**/*.js'

var DST = 'dist'
var DST_COMMON_JS  = 'dist/common/**/*.js'
// var DST_COMMON  = 'dist/common'




module.exports = function (gulp, plugins)
{
	return function ()
	{
		gulp.task('build_common_bundle',
			() => {
				try
				{
					return gulp.src(DST_COMMON_JS)
						// .pipe( plugins.changed(DST_COMMON_JS) )
						.pipe( plugins.concat('devapt-common.js') )
						.pipe( plugins.sourcemaps.init() )
						.pipe( plugins.sourcemaps.write('.') )
						.pipe( gulp.dest(DST) )
				}
				catch(e)
				{
					console.log('build_common_bundle:an error occures', Object.keys(e) )
					// Error: Cannot find module 'fsevents' from 'D:\DATAS\GitHub\devapt\node_modules\chokidar\lib'
				}
				return undefined
			}
		)
	}
}

