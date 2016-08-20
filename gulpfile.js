
'use strict'

// var del = require('del');
var gulp = require('gulp')
var del = require('del')
// var debounce = require('debounce')
// var sourcemaps = require('gulp-sourcemaps');
// var babel = require('gulp-babel');
// var concat = require('gulp-concat');
// var changed = require('gulp-changed');
// var browserSync = require('browser-sync').create();
var runseq = require('run-sequence')
// var jsdoc = require('gulp-jsdoc3');

// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var browserify = require('browserify');
// var watchify = require('watchify');
// var babelify = require('babelify');
// var path = require('path')
// var livereload = require('gulp-livereload')


// var SRC_ALL_JS = 'src/**/*.js'
// var SRC_ALL_JSON = 'src/**/*.json'

// var SRC_BROWSER_INDEX = 'src/browser/index.js'
var SRC_BROWSER_JS = 'src/browser/**/*.js'
var SRC_COMMON_JS  = 'src/common/**/*.js'
var SRC_PLUGINS_JS  = 'src/plugins/**/*.js'
var SRC_SERVER_JS  = 'src/server/**/*.js'

var DST = 'dist'
// var DST_BROWSER_INDEX = 'dist/browser/index.js'
// var DST_BROWSER = 'dist/browser/**/*.js'
// var DST_COMMON  = 'dist/common/**/*.js'
// var DST_SERVER  = 'dist/server/**/*.js'
// var DOCS_API  = 'docs/api/'

var plugins = require('gulp-load-plugins')( { DEBUG:false } )



function getTask(task)
{
	return require('./build/' + task)(gulp, plugins)
}



// **************************************************************************************************
// DEVAPT - BROWSER
// **************************************************************************************************
gulp.task('build_browser_transpile', getTask('gulp_browser_transpile') )
// gulp.task('build_browser_concat', getTask('gulp_browser_concat') )
gulp.task('build_browser_bundle', getTask('gulp_browser_bundle') )
gulp.task('build_browser', (/*cb*/) => runseq(['build_browser_transpile', 'build_browser_bundle']) )

gulp.task('watch_browser',
	() => {
		var watcher = gulp.watch(SRC_BROWSER_JS, ['build_browser'] )
		watcher.on('change',
			(event) => {
				console.log('File ' + event.path + ' was ' + event.type + ', running tasks watch_browser...')	
			}
		)
	}
)
// const delay = 2000
// debounce(cb, delay)



// **************************************************************************************************
// DEVAPT - COMMON
// **************************************************************************************************
gulp.task('build_common_transpile', getTask('gulp_common_transpile') )
// gulp.task('build_common_bundle', getTask('gulp_common_bundle') )
gulp.task('build_common', ['build_common_transpile'] )

gulp.task('watch_common',
	() => {
		var watcher = gulp.watch(SRC_COMMON_JS, ['build_common'] )
		watcher.on('change',
			(event) => {
				console.log('File ' + event.path + ' was ' + event.type + ', running tasks watch_common...')	
			}
		)
	}
)



// **************************************************************************************************
// DEVAPT - PLUGINS
// **************************************************************************************************
gulp.task('build_plugins_transpile', getTask('gulp_plugins_transpile') )
// gulp.task('build_plugins_bundle', getTask('gulp_plugins_bundle') )
gulp.task('build_plugins', ['build_plugins_transpile'] )

gulp.task('watch_plugins',
	() => {
		var watcher = gulp.watch(SRC_PLUGINS_JS, ['build_plugins'] )
		watcher.on('change',
			(event) => {
				console.log('File ' + event.path + ' was ' + event.type + ', running tasks watch_plugins...')	
			}
		)
	}
)



// **************************************************************************************************
// DEVAPT - SERVER
// **************************************************************************************************
gulp.task('build_server_transpile', getTask('gulp_server_transpile') )
// gulp.task('build_server_bundle', getTask('gulp_server_bundle') )
gulp.task('build_server', ['build_server_transpile'] )


gulp.task('build_all_transpile', getTask('gulp_all_transpile') )
gulp.task('build_json_copy', getTask('gulp_json_copy') )

gulp.task('watch_server',
	() => {
		var watcher = gulp.watch(SRC_SERVER_JS, ['build_server'] )
		watcher.on('change',
			(event) => {
				console.log('File ' + event.path + ' was ' + event.type + ', running tasks watch_server...')	
			}
		)
	}
)



// **************************************************************************************************
// DEVAPT - INDEX
// **************************************************************************************************

/*
	COPY INDEX SRC FILE TO DIST/
		build one file
*/
const BABEL_CONFIG = {
	presets: ['es2015']
}
gulp.task('build_index_transpile',
	() => {
		return gulp.src('src/index.js')
			.pipe( plugins.changed('dist') )
			.pipe( plugins.sourcemaps.init() )
			.pipe( plugins.babel(BABEL_CONFIG) )
			.pipe( plugins.sourcemaps.write('.') )
			.pipe( gulp.dest('dist') )
	}
)



// **************************************************************************************************
// DEVAPT - MAIN GULP TASKS
// **************************************************************************************************

/*
    CLEAN DIST DIRECTORY
*/
gulp.task('clean',
	() => {
		return del(DST)
	}
)



// **************************************************************************************************
// DEVAPT - DOCUMENTATION
// **************************************************************************************************

gulp.task('build_doc_api', getTask('gulp_doc_api') )
gulp.task('build_doc_md', getTask('gulp_doc_md') )
gulp.task('build_docs', ['gulp_doc_api', 'build_doc_md'] )



// **************************************************************************************************
// DEVAPT - MAIN
// **************************************************************************************************
var default_tasks = ['build_common_transpile', 'build_server_transpile', 'build_plugins_transpile', 'build_index_transpile', 'build_browser']
var server_tasks = ['build_common_transpile', 'build_server_transpile', 'build_plugins_transpile', 'build_index_transpile']
var browser_tasks = ['build_common_transpile', 'build_browser_transpile', 'build_browser_bundle']
var watch_tasks = ['watch_browser', 'watch_common', 'watch_plugins', 'watch_server']

gulp.task('browser', (/*cb*/) => runseq(browser_tasks) )
gulp.task('server', (/*cb*/) => runseq(server_tasks) )
gulp.task('default', (/*cb*/) => runseq(default_tasks) )
gulp.task('clean_build', (cb) => runseq('clean', ['default'], cb) )

gulp.task('watch', (/*cb*/) => runseq('default', watch_tasks))

// gulp.task('build_bundles', ['build_bundle_common', 'build_bundle_browser', 'build_bundle_server'])

// gulp.task('release', ['build_clean', 'build_bundles'])
