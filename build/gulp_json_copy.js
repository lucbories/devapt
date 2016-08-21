
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

var SRC_ALL_JS = 'src/**/*.js'
var SRC_ALL_JSON = 'src/**/*.json'

// var SRC_COMMON  = 'src/common/**/*.js'
// var SRC_SERVER  = 'src/server/**/*.js'

var DST = 'dist'
// var DST_COMMON  = 'dist/common/**/*.js'
// var DST_SERVER  = 'dist/server/**/*.js'
// var DOCS_API  = 'docs/api/'




const BABEL_CONFIG = {
	presets: ['es2015']
}

module.exports = function (gulp, plugins)
{
	return function (arg_task_name)
	{
		/*
			COPY ALL SRC/ JSON FILES TO DIST/
				build only changed files
		*/
		gulp.task(arg_task_name,
			() => {
				return gulp.src(SRC_ALL_JSON)
					.pipe( plugins.changed(DST) )
					.pipe( gulp.dest(DST) )
			}
		)
	}
}

