
'use strict'


var jsdoc = require('gulp-jsdoc3')


var SRC_BROWSER  = 'src/browser/**/*.js'
var SRC_COMMON  = 'src/common/**/*.js'
var SRC_SERVER  = 'src/server/**/*.js'
var SRC_TUTORIALS  = 'docs/'

var DST_DOCS_API  = 'docs/html/api/'



const jsconfig = {
	"tags": {
		"allowUnknownTags": true
	},
	"source": {
		"excludePattern": "(^|\\/|\\\\|unused_.*|todo_.*)_"
	},
	"opts": {
		"tutorials":SRC_TUTORIALS,
		"destination": DST_DOCS_API
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
module.exports = function (gulp/*, plugins*/)
{
	return function ()
	{
		gulp.task('build_doc_api',
			function(cb)
			{
				gulp.src([SRC_COMMON, SRC_BROWSER, SRC_SERVER])
					.pipe( jsdoc(jsconfig, cb) )
			}
		)
	}
}
