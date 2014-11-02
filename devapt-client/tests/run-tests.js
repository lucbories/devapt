require(['Devapt', 'QUnit', 'backend-foundation5/foundation-init',
	'../../tests/tests-core/types-is-tu', '../../tests/tests-core/types-to-tu', '../../tests/tests-core/types-others-tu',
	'../../tests/tests-datas/storage-json-tu'
	],
	function(Devapt, QUnit, undefined, test_types_is, test_types_to, test_types_others, test_storage_json)
	{
		console.log('Loading Tests');
		
		Devapt.use_css('/devapt-client/lib/qunit-1.15.0/qunit-1.15.0.css');
		
		
		QUnit.module('Types');
		test_types_is();
		test_types_to();
		// test_types_others();
		
		
		QUnit.module('Storage JSON');
		test_storage_json();
		
		
		QUnit.load();
		QUnit.start();
		
		console.log('Leaving Tests');
	}
);