
'use strict'

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
var browserify = require('browserify');
// var watchify = require('watchify');
// var babelify = require('babelify');
// var path = require('path')



// var SRC_ALL_JS = 'src/**/*.js'
// var SRC_ALL_JSON = 'src/**/*.json'

// var SRC_BROWSER_INDEX = 'src/browser/index.js'
// var SRC_BROWSER_JS = 'src/browser/**/*.js'
// var SRC_COMMON  = 'src/common/**/*.js'
// var SRC_SERVER  = 'src/server/**/*.js'

// var DST = 'dist'
var DST_BROWSER = 'dist/browser'
var DST_BROWSER_JS = 'dist/browser/**/*.js'
// var DST_BROWSER_INDEX = 'dist/browser/index.js'
// var DST_BROWSER_BUNDLE = 'devapt-browser.js'
var DST_BROWSER_CONCAT = 'devapt-concat.js'
// var DST_COMMON  = 'dist/common/**/*.js'
// var DST_SERVER  = 'dist/server/**/*.js'
// var DOCS_API  = 'docs/api/'




/*
    BUILD AND COPY ALL SRC/BROWSER FILES TO DIST/
        build all files
*/
module.exports = function (gulp, plugins)
{
	return function ()
	{
		gulp.task('build_browser_concat',
			() => {
				return gulp.src(DST_BROWSER_JS)
					.pipe( plugins.concat(DST_BROWSER_CONCAT) )
					.pipe( plugins.sourcemaps.init() )
					.pipe( plugins.sourcemaps.write('.') )
					.pipe( gulp.dest(DST_BROWSER) )
			}
		)
	}
}
