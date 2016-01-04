
'use strict';

// var del = require('del');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var changed = require('gulp-changed');
var browserSync = require('browser-sync').create();



var SRC_ALL_JS = 'src/**/*.js';
var SRC_ALL_JSON = 'src/**/*.json';
var SRC_APPS = 'src/apps/**/*.js';
var SRC_BROWSER = 'src/browser/**/*.js';
var SRC_COMMON  = 'src/common/**/*.js';
var SRC_SERVER  = 'src/server/**/*.js';

var DST = 'dist';
var DST_APPS = 'dist/apps/**/*.js';
var DST_BROWSER = 'dist/browser/**/*.js';
var DST_COMMON  = 'dist/common/**/*.js';
var DST_SERVER  = 'dist/server/**/*.js';



/*
    BUILD ALL SRC/ JS FILES TO DIST/
        with sourcemap files
        build only changed files
*/
gulp.task('build_all_js', () => {
    return gulp.src(SRC_ALL_JS)
		.pipe(changed(DST))
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['es2015']
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DST));
});


/*
    COPY ALL SRC/ JSON FILES TO DIST/
        build only changed files
*/
gulp.task('build_all_json', () => {
    return gulp.src(SRC_ALL_JSON)
		.pipe(changed(DST))
        .pipe(gulp.dest(DST));
});


/*
    COPY ALL SRC/APPS FILES TO DIST/
        build all files
*/
gulp.task('build_all_apps', () => {
    return gulp.src(SRC_APPS)
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['es2015']
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DST));
});


/*
    COPY ALL SRC/COMMON FILES TO DIST/
        build all files
*/
gulp.task('build_all_common', () => {
    return gulp.src(SRC_COMMON)
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['es2015']
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DST));
});


/*
    COPY ALL SRC/SERVER FILES TO DIST/
        build all files
*/
gulp.task('build_all_server', () => {
    return gulp.src(SRC_SERVER)
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['es2015']
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DST));
});



/*
    BUILD JS BUNDLES
*/
gulp.task('build_bundle_apps', () => {
    return gulp.src(DST_APPS)
        .pipe(concat('devapt-bundle-apps.js'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DST));
});

gulp.task('build_bundle_browser', () => {
    return gulp.src(DST_BROWSER)
        .pipe(concat('devapt-bundle-browser.js'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DST));
});

gulp.task('build_bundle_common', () => {
    return gulp.src(DST_COMMON)
        .pipe(concat('devapt-bundle-common.js'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DST));
});

gulp.task('build_bundle_server', () => {
    return gulp.src(DST_SERVER)
        .pipe(concat('devapt-bundle-server.js'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DST));
});



/*
    DEFINE MAIN GULP TASKS
*/
gulp.task('build_bundles', ['build_bundle_browser', 'build_bundle_common', 'build_bundle_server']);

gulp.task('release', ['build_all_files', 'build_bundles']);

gulp.task('default', ['build_all_js', 'build_all_json']);





// var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
// watcher.on('change', function(event) {
//   console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
// });

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
);
