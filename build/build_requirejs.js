// RUN node r.js -o build_requirejs.js

        
(
	{
		// "dir": "../build/tmp",
		// "appDir": "../dist",
		"baseUrl": "../client/src/js",
		
		"paths": {
			// JQUERY/FOUNDATION COMPATIBILITY : http://jquery.com/browser-support/ and http://foundation.zurb.com/docs/compatibility.html
			
			// FOUNDATION
			"jquery":			"../../lib/foundation-5.5.1/js/vendor/jquery",
			"modernizr":		"../../lib/foundation-5.5.1/js/vendor/modernizr",
			"foundation-min":	"../../lib/foundation-5.5.1/js/foundation.min",
			
			// JQUERY
			/*"jquery":		"../../lib/jquery-1.10.2/jquery-1.10.2.min",*/
			"jquery-ui":	"../../lib/jquery-ui-1.11.4/jquery-ui.min",
			"QUnit":		"../../lib/qunit-1.16.0/qunit-1.16.0",
			
			
			"Q":			"../../lib/q-20150130/q",
			"jStorage":		"../../lib/simplestorage-0.1.3/simplestorage",
			"mustache":		"../../lib/mustache/mustache-wrap",
			"md5":			"../../lib/cryptojs-3.1.2/rollups/md5",
			"sha1":			"../../lib/cryptojs-3.1.2/rollups/sha1",
			// "base64":		"../../lib/cryptojs-3.1.2/components/enc-base64",
			"bind":			"../../lib/bind.js-20150609/bind-wrap"
		},
		
		name: "all",
		
		out: "../dist/devapt-client-all.js"
	}
)
