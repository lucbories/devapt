
'use strict'

var gulp = require('gulp')
var del = require('del')
var runseq = require('run-sequence')
// var livereload = require('gulp-livereload')

var SRC_BROWSER_JS = 'src/browser/**/*.js'
var SRC_COMMON_JS  = 'src/common/**/*.js'
var SRC_PLUGINS_JS  = 'src/plugins/**/*.js'
var SRC_SERVER_JS  = 'src/server/**/*.js'

var DST = 'dist'

var plugins = require('gulp-load-plugins')( { DEBUG:false } )



function getTask(task)
{
	return require('./build/' + task)(gulp, plugins)
}



// **************************************************************************************************
// DEVAPT - BROWSER
// **************************************************************************************************
getTask('gulp_browser_transpile')('build_browser_transpile')
getTask('gulp_browser_bundle')('build_browser_bundle')
gulp.task('build_browser', (cb) => runseq('build_browser_transpile', 'build_browser_bundle', cb) )

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
getTask('gulp_common_transpile')('build_common_transpile')
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
getTask('gulp_plugins_transpile')('build_plugins_transpile')
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
getTask('gulp_server_transpile')('build_server_transpile')
gulp.task('build_server', ['build_server_transpile'] )


getTask('gulp_all_transpile')('build_all_transpile')
getTask('gulp_json_copy')('build_json_copy')

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
// DEVAPT - TEST
// **************************************************************************************************
getTask('gulp_test_transpile')('build_test_transpile')
gulp.task('build_test', ['build_test_transpile'] )

gulp.task('watch_test',
	() => {
		var watcher = gulp.watch(SRC_COMMON_JS, ['build_test'] )
		watcher.on('change',
			(event) => {
				console.log('File ' + event.path + ' was ' + event.type + ', running tasks watch_test...')	
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

getTask('gulp_doc_api')('build_doc_api')
getTask('gulp_doc_md')('build_doc_md')
gulp.task('build_docs', ['gulp_doc_api', 'build_doc_md'] )



// **************************************************************************************************
// DEVAPT - MAIN
// **************************************************************************************************
var watch_tasks = ['watch_browser', 'watch_common', 'watch_plugins', 'watch_server']

gulp.task('browser', (cb) => runseq('build_browser_transpile', 'build_browser_bundle', cb) )
gulp.task('server', (cb) => runseq('build_common_transpile', 'build_server_transpile', 'build_plugins_transpile', 'build_index_transpile', cb) )
gulp.task('default', (cb) => runseq('build_common_transpile', 'build_server_transpile', 'build_plugins_transpile', 'build_index_transpile', 'build_browser_transpile', 'build_browser_bundle', cb) )
gulp.task('clean_build', (cb) => runseq('clean', 'default', cb) )
gulp.task('test', (cb) => runseq('build_common_transpile', 'build_server_transpile', 'build_plugins_transpile', 'build_index_transpile', 'build_browser_transpile', 'build_test_transpile', cb) )

gulp.task('watch', (cb) => runseq('default', watch_tasks, cb))

// gulp.task('build_bundles', ['build_bundle_common', 'build_bundle_browser', 'build_bundle_server'])

// gulp.task('release', ['build_clean', 'build_bundles'])
