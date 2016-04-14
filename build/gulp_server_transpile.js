
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
var SRC_SERVER  = 'src/server/**/*.js'

// var DST = 'dist'
// var DST_COMMON  = 'dist/common/**/*.js'
var DST_SERVER  = 'dist/server'
// var DOCS_API  = 'docs/api/'




const BABEL_CONFIG = {
	presets: ['es2015']
}

module.exports = function (gulp, plugins)
{
	return function ()
	{
		/*
			COPY ALL SRC/SERVER FILES TO DIST/
				build all files
		*/
		gulp.task('build_server_transpile',
			() => {
				return gulp.src(SRC_SERVER)
					.pipe( plugins.changed(DST_SERVER) )
					.pipe( plugins.sourcemaps.init() )
					.pipe( plugins.babel(BABEL_CONFIG) )
					.pipe( plugins.sourcemaps.write('.') )
					.pipe( gulp.dest(DST_SERVER) )
			}
		)
	}
}

