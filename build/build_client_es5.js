var path = require("path"),
	Builder = require('systemjs-builder');


// BUILDER SETTINGS
var foundation_version = '5.5.1';
var builder_config = {
  baseURL: 'client/src/js',
  
  meta: {
	'resource/to/ignore.js' : {
		build: false
    }
  },
  
  // bundles: {
	//   core: ,
	//   datas: ['datas/*.js'],
	//   object: ['object/*.js'],
	//   views: ['views/*.js'],
	//   worker: ['worker/*.js'],
	//   main: ['core', 'datas', 'object', 'views', 'worker'],
	//   root: ['Devapt.js', 'factory.js', 'main']
  // },
  
  // any map config
  paths: {
    // jquery: '../../lib/jquery-1.2.3/jquery'
			'jquery':		'./client/lib/foundation-' + foundation_version + '/js/vendor/jquery.js',
			'modernizr':	'./client/lib/foundation-' + foundation_version + '/js/vendor/modernizr.js',
		/*	'foundation':	'../../lib/foundation-' + foundation_version + '/js/foundation.min',*/
			
			// ALL
			'jquery-ui':	'./client/lib/jquery-ui-1.11.4/jquery-ui.min.js',
			'QUnit':		'./client/lib/qunit-1.16.0/qunit-1.16.0.js',
			// 'runtu':		'tests/run-tests',
			'Q':			'./client/lib/q-20150130/q.js',
		/*	'jStorage':		'../../lib/jstorage-0.4.12/jstorage-wrap', */
			'jStorage':		'./client/lib/simplestorage-0.1.3/simplestorage.js',
			'mustache':		'./client/lib/mustache/mustache-wrap.js',
			'md5':			'./client/lib/cryptojs-3.1.2/rollups/md5.js',
			'sha1':			'./client/lib/cryptojs-3.1.2/rollups/sha1.js',
			// 'base64':		'../../lib/cryptojs-3.1.2/components/enc-base64',
			'bind':			'./client/lib/bind.js-20150609/bind-wrap.js',
  },

  // opt in to Babel for transpiling over Traceur
  transpiler: 'babel'

  // etc. any SystemJS config
};


// BUILD TASK SETTINGS
var build_config = {
	minify: false,
	mangle: true, // for MINIFY: default to true
	
	sourceMaps: true,
	
	sfxFormat: 'es6' // for SFX BUILD: one of cjs/amd/es6
};
var module_root = 'main & Devapt.js & factory.js';
// var module_root = 'bootstrap.js & Devapt.js & factory.js';
// var module_main = 'core/*.js & datas/*.js & object/*.js & views/*.js & worker/*.js';
// var build_plugins = 'plugins/backend-foundation5/*.js & plugins/backend-jquery-ui/*.js';
// var build_input = module_root/* + ' & ' + module_main*/;// + ' & ' + build_plugins ;
// var build_input = 'root.js & main';
var build_input = 'root.js';
var build_output = 'dist/client-es5-es6.js';


// CREATE AND RUN BUILDER
var builder = new Builder(builder_config)
// .build(build_input, build_output, build_config)
.buildSFX(build_input, build_output, build_config)
.then(function()
	{
		console.log('Build complete');
	}
)
.catch(function(err)
	{
		console.log('Build error');
		console.log(err);
	}
);