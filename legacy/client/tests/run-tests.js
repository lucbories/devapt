'use strict';
require(['Devapt', 'QUnit',
	'backend-foundation5/foundation-init',
	'../../tests/tests-core/types-is-tu', '../../tests/tests-core/types-to-tu', '../../tests/tests-core/types-others-tu',
	'../../tests/tests-core/class-tu',
	'../../tests/tests-core/object-base-tu',
	'../../tests/tests-core/object-tu'/*,
	'../../tests/tests-datas/storage-json-tu'*/
	],
	function(Devapt, QUnit,
	undefined,
	test_types_is, test_types_to, test_types_others,
	test_class,
	test_object_base,
	test_object/*,
	test_storage_json*/)
	{
		console.log('Loading Tests');
		
		Devapt.use_css('/devapt-client/lib/qunit-1.16.0/qunit-1.16.0.css');
		
		
		QUnit.module('Types');
		test_types_is();
		test_types_to();
		test_types_others();
		
		QUnit.module('Class');
		test_class();
		
		QUnit.module('ObjectBase');
		test_object_base();
		
		QUnit.module('Object');
		test_object();
		
		// QUnit.module('Storage JSON');
		// test_storage_json();
		
		
		QUnit.load();
		QUnit.start();
		
		console.log('Leaving Tests');
	}
);