require.config(
	{
		baseUrl: '/devapt-client/src/js',
		paths:
		{
			 jquery:		'/devapt-client/lib/foundation-5.0.2/js/jquery',
			 modernizr:		'/devapt-client/lib/foundation-5.0.2/js/modernizr',
			 foundation:	'/devapt-client/lib/foundation-5.0.2/js/foundation.min',
			 QUnit:			'/devapt-client/lib/qunit-1.13.0/qunit-1.13.0',
			 runtu:			'/devapt-client/tests/run-tests'
		},
		map:
		{
			'*': { 'jquery': 'others/jquery-private', 'foundation': 'others/jquery-private' },
			
			'others/jquery-private': { 'jquery': 'jquery' },
			'others/foundation-private': { 'jquery': 'jquery', 'modernizr': 'modernizr', 'foundation': 'foundation' }
		},
		shim:
		{
			'QUnit':
			{
				exports: 'QUnit',
				init: function()
				{
					QUnit.config.autoload = false;
					QUnit.config.autostart = false;
				}
			} 
		},
		
		urlArgs: "bust=" +  (new Date()).getTime()
	}
);

var Devapt = require(['Devapt', 'others/foundation-init']);

