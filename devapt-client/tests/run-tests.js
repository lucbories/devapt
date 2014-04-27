require(['Devapt', 'QUnit', 'others/foundation-init', '../../tests/tests-core/types-tu'],
	function(Devapt, QUnit, f, tu)
	{
		console.log('Loading Tests');
		
		Devapt.use_css('/devapt-client/lib/qunit-1.13.0/qunit-1.13.0.css');
		
		if (typeof tu === 'function')
		{
			tu();
			
			// start QUnit.
			QUnit.load();
			QUnit.start();
		}
		else
		{
			console.log('Bad Tests function');
		}
		
		console.log('Leaving Tests');
	}
);