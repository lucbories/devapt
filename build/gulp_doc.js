
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


var SRC_COMMON  = 'src/common/**/*.js'
var SRC_SERVER  = 'src/server/**/*.js'

// var DOCS_API  = 'docs/api/'



const jsconfig = {
	"tags": {
		"allowUnknownTags": true
	},
	"source": {
		"excludePattern": "(^|\\/|\\\\)_"
	},
	"opts": {
		"destination": "./docs/api"
	},
	"plugins": [
		"plugins/markdown"
	],
	"templates": {
		"cleverLinks": false,
		"monospaceLinks": false,
		"outputSourceFiles": true,
		"path": "ink-docstrap",
		"theme": "cerulean",
		"navType": "inline",
		"linenums": true,
		"dateFormat": "MMMM Do YYYY, h:mm:ss a"
	}
}


/*
	GENERATE DOCS API
*/
module.exports = function (gulp, plugins)
{
	return function ()
	{
		gulp.task('docs_api',
			function(cb)
			{
				gulp.src([SRC_COMMON, SRC_SERVER])
					.pipe( plugins.jsdoc(jsconfig, cb) )
			}
		)
	}
}
