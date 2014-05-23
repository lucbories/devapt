require.config(
	{
		baseUrl: '/devapt-client/src/js',
		paths:
		{
			'jquery':		'/devapt-client/lib/foundation-5.0.2/js/jquery',
			'modernizr':	'/devapt-client/lib/foundation-5.0.2/js/modernizr',
			'foundation':	'/devapt-client/lib/foundation-5.0.2/js/foundation.min',
			'QUnit':		'/devapt-client/lib/qunit-1.13.0/qunit-1.13.0',
			'runtu':		'/devapt-client/tests/run-tests',
			'jStorage':		'/devapt-client/lib/jstorage-0.4.3/jstorage',
			'mustache':		'/devapt-client/lib/mustache/mustache-wrap',
			
			'foundation':				'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation',
			'foundation.abide':			'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.abide',
			'foundation.accordion':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.accordion',
			'foundation.alert':			'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.alert',
			'foundation.clearing':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.clearing',
			'foundation.dropdown':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.dropdown',
			'foundation.interchange':	'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.interchange',
			'foundation.joyride':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.joyride',
			'foundation.magellan':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.magellan',
			'foundation.offcanvas':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.offcanvas',
			'foundation.orbit':			'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.orbit',
			'foundation.reveal':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.reveal',
			'foundation.tab':			'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.tab',
			'foundation.topbar':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.topbar',
			'foundation.tooltip':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.tooltip',
			'foundation.topbar':		'/devapt-client/lib/foundation-5.0.2/js/foundation/foundation.topbar'
		},
		
		// map:
		// {
			// '*': { 'jquery': 'others/jquery-private', 'foundation': 'others/foundation-private' },
			
			// 'others/jquery-private': { 'jquery': 'jquery' },
			// 'others/foundation-private': { 'jquery': 'jquery', 'modernizr': 'modernizr', 'foundation': 'foundation' }
			
			// 'foundation.all':
			// {
				// 'foundation.alert':'foundation.alert', 'foundation.dropdown':'foundation.dropdown', 'foundation.tooltips':'foundation.tooltips', 'foundation.topbar':'foundation.topbar'
			// }
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
			}
		}/*,
		
		urlArgs: 'bust=' +  (new Date()).getTime()*/
	}
);

// require(['Devapt'], function(Devapt)
// {
	// Devapt.run();
// } );
