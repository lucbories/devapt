
'use strict'

var fs = require('fs')
var gulpShowdown = require('gulp-showdown')
var headerfooter = require('gulp-headerfooter')


var SRC_README  = 'README.md'
var SRC_PROJECT  = 'docs/*.md'
var SRC_TUTORIALS  = 'docs/tutorials/*.md'
var SRC_FEATURES  = 'docs/features/*.md'

var DST_PROJECT_PART = 'docs/html_part/'
var DST_TUTORIALS_PART = 'docs/html_part/tutorials/'
var DST_FEATURES_PART = 'docs/html_part/features/'

var DST_PROJECT = 'docs/html/'
// var DST_TUTORIALS = 'docs/html'
// var DST_FEATURES = 'docs/html'

var FILE_HTML_HEADER = 'docs/html_layout/header.html'
var FILE_HTML_FOOTER = 'docs/html_layout/footer.html'


var header = fs.readFileSync(FILE_HTML_HEADER)
var footer = fs.readFileSync(FILE_HTML_FOOTER)


/*
	GENERATE DOCS API
*/
module.exports = function (gulp/*, plugins*/)
{
	return function ()
	{
		gulp.task('build_doc_md',
			function(/*cb*/)
			{
				gulp.src(SRC_README)
					.pipe(gulpShowdown())
					.pipe(gulp.dest(DST_PROJECT_PART))
					
				gulp.src(SRC_PROJECT)
					.pipe(gulpShowdown())
					.pipe(gulp.dest(DST_PROJECT_PART))
					
				gulp.src(SRC_TUTORIALS)
					.pipe(gulpShowdown())
					.pipe(gulp.dest(DST_TUTORIALS_PART))

				gulp.src(SRC_FEATURES)
					.pipe(gulpShowdown())
					.pipe(gulp.dest(DST_FEATURES_PART))

				gulp.src(DST_PROJECT_PART + '/*.html')
					.pipe(headerfooter.header(header))
					.pipe(headerfooter.footer(footer))
					.pipe(gulp.dest(DST_PROJECT))
			}
		)
	}
}
