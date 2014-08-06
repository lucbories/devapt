foundation_version = '5.3.1';
// foundation_version = '5.0.2';

require.config(
	{
		baseUrl: '/devapt-client/src/js',
		paths:
		{
			// JQUERY/FOUNDATION COMPATIBILITY : http://jquery.com/browser-support/ and http://foundation.zurb.com/docs/compatibility.html
			
			// IE >= 6
			/*'jquery':		'/devapt-client/lib/jquery-1.10.2/jquery-1.10.2.min',*/
			
			// IE >= 9
			'jquery':		'/devapt-client/lib/foundation-' + foundation_version + '/js/lib/jquery',
			'modernizr':	'/devapt-client/lib/foundation-' + foundation_version + '/js/lib/modernizr',
			'foundation':	'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation.min',
			
			// ALL
			'QUnit':		'/devapt-client/lib/qunit-1.13.0/qunit-1.13.0',
			'runtu':		'/devapt-client/tests/run-tests',
			'jStorage':		'/devapt-client/lib/jstorage-0.4.3/jstorage',
			'mustache':		'/devapt-client/lib/mustache/mustache-wrap',
			
			'foundation-min':			'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation.min',
			'foundation':				'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation',
			'foundation.abide':			'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.abide',
			'foundation.accordion':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.accordion',
			'foundation.alert':			'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.alert',
			'foundation.clearing':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.clearing',
			'foundation.dropdown':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.dropdown',
			'foundation.interchange':	'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.interchange',
			'foundation.joyride':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.joyride',
			'foundation.magellan':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.magellan',
			'foundation.offcanvas':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.offcanvas',
			'foundation.orbit':			'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.orbit',
			'foundation.reveal':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.reveal',
			'foundation.tab':			'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.tab',
			'foundation.topbar':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.topbar',
			'foundation.tooltip':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.tooltip',
			'foundation.topbar':		'/devapt-client/lib/foundation-' + foundation_version + '/js/foundation/foundation.topbar'
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
