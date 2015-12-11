
'use strict';

// var del = require('del');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var changed = require('gulp-changed');



var SRC_ALL = 'src/**/*.js';
var SRC_BROWSER = 'src/browser/**/*.js';
var SRC_COMMON  = 'src/common/**/*.js';
var SRC_SERVER  = 'src/server/**/*.js';

var DST = 'dist';
var DST_BROWSER = 'dist/browser/**/*.js';
var DST_COMMON  = 'dist/common/**/*.js';
var DST_SERVER  = 'dist/server/**/*.js';



/*
    BUILD ALL SRC/ FILES TO DIST/
        with sourcemap files
        build only changed files
*/
gulp.task('build_all_files', () => {
    return gulp.src(SRC_ALL)
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
    BUILD JS BUNDLES
*/
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

gulp.task('default', ['build_all_files']);
