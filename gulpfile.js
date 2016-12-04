
'use strict'

var gulp = require('gulp')
var del = require('del')
var livereload = require('gulp-livereload')

var SRC_BROWSER_JS = 'src/browser/**/*.js'
var SRC_COMMON_JS  = 'src/common/**/*.js'
var SRC_PLUGINS_JS  = 'src/plugins/**/*.js'
var SRC_SERVER_JS  = 'src/server/**/*.js'

var DST = 'dist'

var plugins = require('gulp-load-plugins')( { DEBUG:false } )



function getTask(arg_file_name, arg_task_name)
{
	console.log('loading task [%s] from file [%s]', arg_task_name, arg_file_name)
	return require('./build/' + arg_file_name)(gulp, plugins, arg_task_name)
}



// **************************************************************************************************
// DEVAPT - BROWSER
// **************************************************************************************************
getTask('gulp_browser_transpile', 'build_browser_transpile')
getTask('gulp_browser_bundle', 'build_browser_bundle')
getTask('gulp_browser_bundle_watch', 'watch_browser_bundle')
gulp.task('build_browser', gulp.series('build_browser_transpile', 'build_browser_bundle') )

gulp.task('watch_browser',
	() => {
		gulp.watch(SRC_BROWSER_JS, gulp.series('build_browser_transpile') )
		.on('change',
			(path, stats) => {
				console.log('File ' + path + ' was changed, running task watch_browser...')	
			}
		)
		.on('unlink',
			(path, stats) => {
				console.log('File ' + path + ' was deleted, running task watch_browser...')	
			}
		)
	}
)

/*
	LIVE RELOAD SERVER
*/
gulp.task('livereload',
	(done) => {
		return livereload.listen() || done()
	}
)



// **************************************************************************************************
// DEVAPT - COMMON
// **************************************************************************************************
getTask('gulp_common_transpile', 'build_common_transpile')
gulp.task('build_common', gulp.series('build_common_transpile', (done)=>done()) )

gulp.task('watch_common',
	() => {
		gulp.watch(SRC_COMMON_JS, gulp.series('build_common') )
		.on('change',
			(path, stats) => {
				console.log('File ' + path + ' was changed, running task watch_common...')	
			}
		)
		.on('unlink',
			(path, stats) => {
				console.log('File ' + path + ' was deleted, running task watch_common...')	
			}
		)
	}
)



// **************************************************************************************************
// DEVAPT - PLUGINS
// **************************************************************************************************
getTask('gulp_plugins_transpile', 'build_plugins_transpile')
gulp.task('build_plugins', gulp.series('build_plugins_transpile', (done)=>done()) )

gulp.task('watch_plugins',
	() => {
		gulp.watch(SRC_PLUGINS_JS, gulp.series('build_plugins') )
		.on('change',
			(path, stats) => {
				console.log('File ' + path + ' was changed, running task watch_plugins...')	
			}
		)
		.on('unlink',
			(path, stats) => {
				console.log('File ' + path + ' was deleted, running task watch_plugins...')	
			}
		)
	}
)



// **************************************************************************************************
// DEVAPT - SERVER
// **************************************************************************************************
getTask('gulp_server_transpile', 'build_server_transpile')
gulp.task('build_server', gulp.series('build_server_transpile', (done)=>done()) )


getTask('gulp_all_transpile', 'build_all_transpile')
getTask('gulp_json_copy', 'build_json_copy')

gulp.task('watch_server',
	() => {
		gulp.watch(SRC_SERVER_JS, gulp.series('build_server') )
		.on('change',
			(path, stats) => {
				console.log('File ' + path + ' was changed, running task watch_server...')	
			}
		)
		.on('unlink',
			(path, stats) => {
				console.log('File ' + path + ' was deleted, running task watch_server...')	
			}
		)
	}
)


// **************************************************************************************************
// DEVAPT - TEST
// **************************************************************************************************
getTask('gulp_test_transpile', 'build_test_transpile')
gulp.task('build_test', gulp.series('build_test_transpile', (done)=>done()) )

gulp.task('watch_test',
	() => {
		gulp.watch(SRC_COMMON_JS, gulp.series('build_test') )
		.on('change',
			(path, stats) => {
				console.log('File ' + path + ' was changed, running task watch_test...')
			}
		)
		.on('unlink',
			(path, stats) => {
				console.log('File ' + path + ' was deleted, running task watch_test...')
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

getTask('gulp_doc_api', 'build_doc_api')
getTask('gulp_doc_md', 'build_doc_md')
gulp.task('build_docs', gulp.series('build_doc_api', 'build_doc_md') )



// **************************************************************************************************
// DEVAPT - MAIN
// **************************************************************************************************
var watch_tasks = ['watch_browser', 'watch_browser_bundle', 'watch_common', 'watch_plugins', 'watch_server', 'livereload']

gulp.task('browser',     gulp.series('build_browser_transpile', 'build_browser_bundle') )
gulp.task('server',      gulp.series('build_common_transpile', 'build_server_transpile', 'build_plugins_transpile', 'build_index_transpile') )
gulp.task('default',     gulp.series('build_common_transpile', 'build_server_transpile', 'build_plugins_transpile', 'build_index_transpile', 'build_browser_transpile', 'build_browser_bundle') )
gulp.task('clean_build', gulp.series('clean', 'default') )
gulp.task('test',        gulp.series('build_common_transpile', 'build_server_transpile', 'build_plugins_transpile', 'build_index_transpile', 'build_browser_transpile', 'build_test_transpile') )

gulp.task('watch', gulp.series('default', gulp.parallel(...watch_tasks) ) )

