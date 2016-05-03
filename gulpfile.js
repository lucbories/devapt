
'use strict'

// var del = require('del');
var gulp = require('gulp')
var del = require('del')
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
// var SRC_BROWSER = 'src/browser/**/*.js'
// var SRC_COMMON  = 'src/common/**/*.js'
// var SRC_SERVER  = 'src/server/**/*.js'

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


gulp.task('build_browser_transpile', getTask('gulp_browser_transpile') )
gulp.task('build_browser_concat', getTask('gulp_browser_concat') )
gulp.task('build_browser_bundle', getTask('gulp_browser_bundle') )
gulp.task('build_browser', ['build_browser_transpile', 'build_browser_concat', 'build_browser_bundle'] )

gulp.task('watch',
    () => {
        var SRC_BROWSER_JS = 'src/browser/**/*.js'
        var watcher = gulp.watch(SRC_BROWSER_JS, ['build_browser_transpile', 'build_browser_concat', 'build_browser_bundle'])
        watcher.on('change',
            (event) => {
                console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');	
            }
        )
    }
)

gulp.task('build_common_transpile', getTask('gulp_common_transpile') )
gulp.task('build_common_bundle', getTask('gulp_common_bundle') )
gulp.task('build_common', ['build_common_transpile', 'build_common_bundle'] )

gulp.task('build_plugins_transpile', getTask('gulp_plugins_transpile') )
gulp.task('build_plugins_bundle', getTask('gulp_plugins_bundle') )
gulp.task('build_plugins', ['build_plugins_transpile', 'build_plugins_bundle'] )

gulp.task('build_server_transpile', getTask('gulp_server_transpile') )
gulp.task('build_server_bundle', getTask('gulp_server_bundle') )
gulp.task('build_server', ['build_server_transpile', 'build_server_bundle'] )


gulp.task('build_docs', getTask('gulp_doc') )
gulp.task('build_all_transpile', getTask('gulp_all_transpile') )
gulp.task('build_json_copy', getTask('gulp_json_copy') )

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
			.pipe( plugins.changed('src/index.js') )
			.pipe( plugins.sourcemaps.init() )
			.pipe( plugins.babel(BABEL_CONFIG) )
			.pipe( plugins.sourcemaps.write('.') )
			.pipe( gulp.dest('dist') )
	}
)


/*
    CLEAN DIST DIRECTORY
*/
gulp.task('clean',
	() => {
		return del(DST)
	}
)


/*
    DEFINE MAIN GULP TASKS
*/
var default_tasks = ['build_common_transpile', 'build_plugins_transpile', 'build_server_transpile', 'build_index_transpile', 'build_browser']
gulp.task('default_all', (/*cb*/) => runseq(default_tasks) )

var default_srv_tasks = ['build_common_transpile', 'build_server_transpile', 'build_plugins_transpile']
gulp.task('default', (/*cb*/) => runseq(default_srv_tasks) )

// gulp.task('build_clean', (cb) => runseq('clean', ['default', 'build_json_copy'], cb) )

// gulp.task('build_bundles', ['build_bundle_common', 'build_bundle_browser', 'build_bundle_server'])

// gulp.task('release', ['build_clean', 'build_bundles'])





// var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
// watcher.on('change', function(event) {
//   console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
// });
/*
gulp.task('js-watch', ['build_all_js'], browserSync.reload);
gulp.task('serve', ['build_all_js'],
    function ()
    {
        // Serve files from the root of this project
        browserSync.init({
            server: {
                baseDir: "./"
            }
        });
    
        // add browserSync.reload to the tasks array to make
        // all browsers reload after tasks are complete.
        var watcher = gulp.watch(SRC_ALL_JS, ['js-watch']);
        watcher.on('change',
            function(event)
            {
                console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            }
        );
    }
);*/
