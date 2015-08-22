'use strict';

var foundation_version = '5.5.1';
// var foundation_version = '5.4.6';
// foundation_version = '5.3.3';
// foundation_version = '5.0.2';

require.config(
	{
		baseUrl: '/client/src/js',
		paths:
		{
			// JQUERY/FOUNDATION COMPATIBILITY : http://jquery.com/browser-support/ and http://foundation.zurb.com/docs/compatibility.html
			
			// IE >= 6
			/*'jquery':		'../../lib/jquery-1.10.2/jquery-1.10.2.min',*/
			
			// IE >= 9
			'jquery':		'../../lib/foundation-' + foundation_version + '/js/vendor/jquery',
			'modernizr':	'../../lib/foundation-' + foundation_version + '/js/vendor/modernizr',
		/*	'foundation':	'../../lib/foundation-' + foundation_version + '/js/foundation.min',*/
			
			// ALL
			'jquery-ui':	'../../lib/jquery-ui-1.11.4/jquery-ui.min',
			'QUnit':		'../../lib/qunit-1.16.0/qunit-1.16.0',
			
			'Q':			'../../lib/q-20150130/q',
		/*	'jStorage':		'../../lib/jstorage-0.4.12/jstorage-wrap', */
			'jStorage':		'../../lib/simplestorage-0.1.3/simpleStorage',
			'mustache':		'../../lib/mustache/mustache-wrap',
			'md5':			'../../lib/cryptojs-3.1.2/rollups/md5',
			'sha1':			'../../lib/cryptojs-3.1.2/rollups/sha1',
			// 'base64':		'../../lib/cryptojs-3.1.2/components/enc-base64',
			'bind':			'../../lib/bind.js-20150609/bind-wrap',
			
			'foundation-min':			'../../lib/foundation-' + foundation_version + '/js/foundation.min',
			'foundation':				'../../lib/foundation-' + foundation_version + '/js/foundation/foundation',
			'foundation.abide':			'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.abide',
			'foundation.accordion':		'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.accordion',
			'foundation.alert':			'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.alert',
			'foundation.clearing':		'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.clearing',
			'foundation.dropdown':		'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.dropdown',
			'foundation.interchange':	'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.interchange',
			'foundation.joyride':		'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.joyride',
			'foundation.magellan':		'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.magellan',
			'foundation.offcanvas':		'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.offcanvas',
			'foundation.orbit':			'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.orbit',
			'foundation.reveal':		'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.reveal',
			'foundation.tab':			'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.tab',
			'foundation.tooltip':		'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.tooltip',
			'foundation.topbar':		'../../lib/foundation-' + foundation_version + '/js/foundation/foundation.topbar'
		},
		
		// map:
		// {
			// '*': { 'jquery': 'others/jquery-private', 'foundation': 'others/foundation-private' },
			
			// 'others/jquery-private': { 'jquery': 'jquery' },
			// 'others/foundation-private': { 'jquery': 'jquery', 'modernizr': 'modernizr', 'foundation': 'foundation' }
			
		// },
		
		shim:
		{
			'jquery':
			{
				exports: 'jQuery'
			},
			'foundation':
			{
				deps: ['jquery']
			},
			'foundation.abide':
			{
				deps: ['foundation']
			},
			'foundation.accordion':
			{
				deps: ['foundation']
			},
			'foundation.alert':
			{
				deps: ['foundation']
			},
			'foundation.clearing':
			{
				deps: ['foundation']
			},
			'foundation.dropdown':
			{
				deps: ['foundation']
			},
			'foundation.interchange':
			{
				deps: ['foundation']
			},
			'foundation.joyride':
			{
				deps: ['foundation']
			},
			'foundation.magellan':
			{
				deps: ['foundation']
			},
			'foundation.offcanvas':
			{
				deps: ['foundation']
			},
			'foundation.orbit':
			{
				deps: ['foundation']
			},
			'foundation.reveal':
			{
				deps: ['foundation']
			},
			'foundation.tab':
			{
				deps: ['foundation']
			},
			'foundation.tooltip':
			{
				deps: ['foundation']
			},
			'foundation.topbar':
			{
				deps: ['foundation']
			},
			
			'QUnit':
			{
				exports: 'QUnit',
				init: function()
				{
					QUnit.config.autoload = false;
					QUnit.config.autostart = false;
				}
			},
			
			'foundation.all':
			{
				deps: ['foundation.alert', 'foundation.dropdown', 'foundation.tooltip', 'foundation.topbar', 'foundation.accordion', 'foundation.reveal', 'foundation.tab'/*, 'foundation.', 'foundation.', 'foundation.', 'foundation.'*/]
			}
		},
		
		urlArgs: 'bust=' +  (new Date()).getTime()
	}
);
