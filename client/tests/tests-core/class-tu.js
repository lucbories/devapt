/**
 * @file        class-tu.js
 * @desc        Devapt class tests unit
 * @ingroup     LIBAPT_CORE
 * @date        2014-22-14
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/class'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClass)
{
	console.log('Load qUnit test for DevaptClass');
	
	var jQuery = Devapt.jQuery();
	
	
	// DECLARE CLASS A
	var settings_A = {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-01',
			'updated':'2014-11-01',
			'description':'Class A.'
		},
		'properties':[
			{
				name:'A_prop_1_int',
				description:'property 1 of class A',
				
				visibility:'public',
				is_static:false,
				is_readonly:false,
				is_initializable:true,
				
				is_required:false,
				type:'integer',
				default_value:-1,
				alias:[]
			},
			{
				name:'A_prop_2_str',
				description:'property 1 of class A',
				
				visibility:'public',
				is_static:false,
				is_readonly:false,
				is_initializable:true,
				
				is_required:true,
				type:'string',
				default_value:'A2 default',
				alias:[]
			}
		]
	};
	var DevaptClassA = new DevaptClass('DevaptClassA', null, settings_A);
	DevaptClassA.add_public_method('methodA_1',
		function()
		{
			var self = this;
			// console.log(self, 'methodA_1 self');
			// console.log(arguments, 'methodA_1 args');
			return self._class.infos.class_name + '.methodA_1';
		}
	);
	DevaptClassA.add_public_method('methodA_2',
		{
			description: 'method 2 of class A',
			operands: [ { type:'string', name:'text', required:false} ],
			result: { type:'string' }
		},
		function(arg_text)
		{
			var self = this;
			// console.log(self, 'methodA_2 self');
			// console.log(arguments, 'methodA_2 args');
			return self._class.infos.class_name + '.methodA_2:' + (arg_text ? arg_text : 'no args');
		}
	);
	DevaptClassA.build_class();
	console.log(DevaptClassA, 'DevaptClassA');
	
	
	// DECLARE CLASS B
	var settings_B = {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-02',
			'updated':'2014-11-02',
			'description':'Class B.'
		},
		'properties':[
			{
				name:'B_prop_1_array',
				description:'property 1 of class B',
				
				visibility:'public',
				is_static:false,
				is_readonly:false,
				is_initializable:true,
				
				is_required:true,
				type:'array',
				array_separator:':',
				array_type:'string',
				default_value:['a'],
				alias:[]
			},
			{
				name:'B_prop_2_obj',
				description:'property 2 of class B',
				
				visibility:'public',
				is_static:false,
				is_readonly:false,
				is_initializable:true,
				
				is_required:true,
				type:'object',
				default_value:{attr1:'1'},
				alias:[],
				
				children: [
					{
						name:'attr1',
						description:'property 1 of class A child 1',
						
						visibility:'public',
						is_static:false,
						is_readonly:false,
						is_initializable:true,
						
						is_required:false,
						type:'string',
						default_value:'-1',
						alias:[],
						
						children: []
					},
					{
						name:'attr2',
						description:'property 1 of class A child 2',
						
						visibility:'public',
						is_static:false,
						is_readonly:false,
						is_initializable:true,
						
						is_required:false,
						type:'string',
						default_value:'-2',
						alias:[],
						
						children: []
					}
				]
			}
		]
	};
	var DevaptClassB = new DevaptClass('DevaptClassB', DevaptClassA, settings_B);
	DevaptClassB.add_public_method('methodB_1',
		function()
		{
			var self = this;
			// console.log(self, 'methodB_1 self');
			// console.log(arguments, 'methodB_1 args');
			return self._class.infos.class_name + '.methodB_1';
		}
	);
	DevaptClassB.add_public_method('methodA_1',
		{
			description: 'method 1 of class A overrided in class B',
			operands: [],
			result: { type:'string' }
		},
		function()
		{
			var self = this;
			// console.log(self, 'methodA_1 self');
			// console.log(arguments, 'methodA_1 args');
			return self._class.infos.class_name + '.methodA_1';
		}
	);
	DevaptClassB.add_public_method('methodB_2',
		{
			description: 'method 2 of class B',
			operands: [ { type:'string', name:'text2', required:true}, { type:'string', name:'text2', required:true} ],
			result: { type:'string' }
		},
		function(arg_text1, arg_text2)
		{
			var self = this;
			// console.log(self, 'methodB_2 self');
			// console.log(arguments, 'methodB_2 args');
			return self._class.infos.class_name + '.methodB_2:' + arg_text1 + ':' + arg_text2;
		}
	);
	DevaptClassB.build_class();
	console.log(DevaptClassB, 'DevaptClassB');
	
	
	// CREATE INSTANCES OF CLASS A
	var objectA_1 = DevaptClassA.create('nameA_1');
	var objectA_2 = DevaptClassA.create('nameA_2', { A_prop_1_int:123, A_prop_2_str:'abc'} );
	console.log(objectA_1, 'objectA_1');
	console.log(objectA_2, 'objectA_2');
	
	
	// CREATE INSTANCES OF CLASS B
	var objectB_1 = DevaptClassB.create('nameB_1', { A_prop_2_str:'abcdef', B_prop_1_array:'123:456:789', B_prop_2_obj:'attr1=a,attr2=b' } );
	var objectB_2 = DevaptClassB.create('nameB_2', { A_prop_1_int:999, A_prop_2_str:'nameB_2 prop 2', B_prop_1_array:['123','456','789'], B_prop_2_obj:{attr1:'a',attr2:'b'} } );
	console.log(objectB_1, 'objectB_1');
	console.log(objectB_2, 'objectB_2');
	
	
	function run_tests()
	{
		console.log('Running qUnit test for DevaptClass');
		
		test('DevaptClass check class build with ClassA', 32,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(DevaptClassA.infos), 'DevaptClassA.infos');
				
				equal(DevaptClassA.infos.name,					settings_A.name, 'DevaptClassA.infos.name');
				equal(DevaptClassA.infos.class_name,			'DevaptClassA', 'DevaptClassA.infos.class_name');
				equal(DevaptClassA.infos.class_uid,				null, 'DevaptClassA.infos.class_uid');
				equal(DevaptClassA.infos.author,				settings_A.infos.author, 'DevaptClassA.infos.author');
				equal(DevaptClassA.infos.created,				settings_A.infos.created, 'DevaptClassA.infos.created');
				equal(DevaptClassA.infos.updated,				settings_A.infos.updated, 'DevaptClassA.infos.updated');
				equal(DevaptClassA.infos.description,			settings_A.infos.description, 'DevaptClassA.infos.description');
				equal(DevaptClassA.infos.parent_class,	null, 'DevaptClassA.infos.parent_class');
				ok(DevaptTypes.is_object(DevaptClassA.infos.proto), 'DevaptClassA.infos.proto');
				ok(DevaptTypes.is_function(DevaptClassA.infos.ctor), 'DevaptClassA.infos.ctor');
				
				// CHECK METHODS
				ok(DevaptTypes.is_function(DevaptClassA.add_public_method), 'DevaptClassA.add_public_method');
				ok(DevaptTypes.is_function(DevaptClassA.add_static_method), 'DevaptClassA.add_static_method');
				ok(DevaptTypes.is_function(DevaptClassA.build_class), 'DevaptClassA.create');
				ok(DevaptTypes.is_object(DevaptClassA.decorators), 'DevaptClassA.decorators');
				
				// CHECK BUILD
				ok(DevaptClassA.is_build, 'DevaptClassA.is_build'); // TEST 18
				
				// CHECK DECORATORS REPOSITORY
				equal(Object.keys(DevaptClassA.decorators.all_map).length,			0, 'DevaptClassA.decorators.all_map');
				equal(DevaptClassA.decorators.all_ordered.length,					0, 'DevaptClassA.decorators.all_ordered');
				equal(Object.keys(DevaptClassA.decorators.own_map).length,			0, 'DevaptClassA.decorators.own_map');
				equal(DevaptClassA.decorators.own_ordered.length,					0, 'DevaptClassA.decorators.own_ordered');
				
				// CHECK MIXINS REPOSITORY
				equal(Object.keys(DevaptClassA.mixins.all_map).length,				0, 'DevaptClassA.mixins.all_map');
				equal(DevaptClassA.mixins.all_ordered.length,						0, 'DevaptClassA.mixins.all_ordered');
				equal(Object.keys(DevaptClassA.mixins.own_map).length,				0, 'DevaptClassA.mixins.own_map');
				equal(DevaptClassA.mixins.own_ordered.length,						0, 'DevaptClassA.mixins.own_ordered');
				
				// CHECK METHODS REPOSITORY
				equal(Object.keys(DevaptClassA.methods.all_map).length,				2, 'DevaptClassA.methods.all_map');
				equal(DevaptClassA.methods.all_ordered.length,						2, 'DevaptClassA.methods.all_ordered');
				equal(Object.keys(DevaptClassA.methods.own_map).length,				2, 'DevaptClassA.methods.own_map');
				equal(DevaptClassA.methods.own_ordered.length,						2, 'DevaptClassA.methods.own_ordered');
				
				// CHECK PROPERTIES REPOSITORY
				equal(Object.keys(DevaptClassA.properties.all_map).length,			6, 'DevaptClassA.properties.all_map');
				equal(DevaptClassA.properties.all_ordered.length,					6, 'DevaptClassA.properties.all_ordered');
				equal(Object.keys(DevaptClassA.properties.own_map).length,			6, 'DevaptClassA.properties.own_map');
				equal(DevaptClassA.properties.own_ordered.length,					6, 'DevaptClassA.properties.own_ordered');
			}
		);
		
		
		test('DevaptClass check class instance objectA_1 of ClassA', 13,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(objectA_1), 'is_object(objectA_1)');
				equal(typeof(objectA_1), 'object', 'typeof(objectA_1) == object');
				equal(typeof(DevaptClassA), 'object', 'typeof(DevaptClassA) == object');
				
				ok(objectA_1.prototype == DevaptClassA.infos.proto, 'objectA_1.prototype == DevaptClassA.infos.proto');
				equal(objectA_1.class_name, DevaptClassA.infos.class_name, 'objectA_1.class_name = DevaptClassA.infos.class_name');
				
				ok(DevaptTypes.is_function(objectA_1.methodA_1), 'is_function(objectA_1.methodA_1)');
				ok(DevaptTypes.is_function(objectA_1.methodA_2), 'is_function(objectA_1.methodA_2)');
				
				equal(objectA_1.methodA_1(), 'DevaptClassA.methodA_1', 'objectA_1.methodA_1() result');
				equal(objectA_1.methodA_2('hello'), 'DevaptClassA.methodA_2:hello', 'objectA_1.methodA_2() result');
				
				ok(DevaptTypes.is_integer(objectA_1.A_prop_1_int), 'is_integer(objectA_1.A_prop_1_int)');
				ok(DevaptTypes.is_string(objectA_1.A_prop_2_str), 'is_string(objectA_1.A_prop_2_str)');
				
				equal(objectA_1.A_prop_1_int, -1, 'objectA_1.A_prop_1_int = -1');
				equal(objectA_1.A_prop_2_str, 'A2 default', 'objectA_1.A_prop_2_str = abc');
			}
		);
		
		
		test('DevaptClass check class instance objectA_2 of ClassA', 13,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(objectA_2), 'is_object(objectA_2)');
				equal(typeof(objectA_2), 'object', 'typeof(objectA_2) == object');
				equal(typeof(DevaptClassA), 'object', 'typeof(DevaptClassA) == object');
				
				ok(objectA_2.prototype == DevaptClassA.infos.proto, 'objectA_2.prototype == DevaptClassA.infos.proto');
				equal(objectA_2.class_name, DevaptClassA.infos.class_name, 'objectA_2.class_name = DevaptClassA.infos.class_name');
				
				ok(DevaptTypes.is_function(objectA_2.methodA_1), 'is_function(objectA_2.methodA_1)');
				ok(DevaptTypes.is_function(objectA_2.methodA_2), 'is_function(objectA_2.methodA_2)');
				
				equal(objectA_2.methodA_1(), 'DevaptClassA.methodA_1', 'objectA_2.methodA_1() result');
				equal(objectA_2.methodA_2(), 'DevaptClassA.methodA_2:no args', 'objectA_2.methodA_2() result');
				
				ok(DevaptTypes.is_integer(objectA_2.A_prop_1_int), 'is_integer(objectA_2.A_prop_1_int)');
				ok(DevaptTypes.is_string(objectA_2.A_prop_2_str), 'is_string(objectA_2.A_prop_2_str)');
				
				equal(objectA_2.A_prop_1_int, 123, 'objectA_2.A_prop_1_int = 123');
				equal(objectA_2.A_prop_2_str, 'abc', 'objectA_2.A_prop_2_str = abc');
			}
		);
		
		
		test('DevaptClass check class build with ClassB', 28,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(DevaptClassB.infos), 'DevaptClassB.infos');
				
				equal(DevaptClassB.infos.name,					settings_B.name, 'DevaptClassB.infos.name');
				equal(DevaptClassB.infos.class_name,			'DevaptClassB', 'DevaptClassB.infos.class_name');
				equal(DevaptClassB.infos.class_uid,				null, 'DevaptClassB.infos.class_uid');
				equal(DevaptClassB.infos.author,				settings_B.infos.author, 'DevaptClassB.infos.author');
				equal(DevaptClassB.infos.created,				settings_B.infos.created, 'DevaptClassB.infos.created');
				equal(DevaptClassB.infos.updated,				settings_B.infos.updated, 'DevaptClassB.infos.updated');
				equal(DevaptClassB.infos.description,			settings_B.infos.description, 'DevaptClassB.infos.description');
				
				ok(DevaptTypes.is_object(DevaptClassB.infos.parent_class), 'DevaptClassB.infos.parent_class');
				equal(DevaptClassB.infos.parent_class.infos.class_name, 'DevaptClassA', 'DevaptClassB.infos.parent_class');
				equal(DevaptClassB.infos.parent_class, DevaptClassA, 'DevaptClassB.infos.parent_class');
				
				ok(DevaptTypes.is_object(DevaptClassB.infos.proto), 'DevaptClassB.infos.proto');
				ok(DevaptTypes.is_function(DevaptClassB.infos.ctor), 'DevaptClassB.infos.ctor');
				
				// CHECK METHODS
				ok(DevaptTypes.is_function(DevaptClassB.add_public_method), 'DevaptClassB.add_public_method');
				ok(DevaptTypes.is_function(DevaptClassB.add_static_method), 'DevaptClassB.add_static_method');
				ok(DevaptTypes.is_function(DevaptClassB.build_class), 'DevaptClassB.create');
				ok(DevaptTypes.is_object(DevaptClassB.decorators), 'DevaptClassB.decorators');
				
				// CHECK BUILD
				ok(DevaptClassB.is_build, 'DevaptClassB.is_build');
				
				// CHECK DECORATORS REPOSITORY
				equal(Object.keys(DevaptClassA.decorators.all_map).length,			0, 'DevaptClassA.decorators.all_map');
				equal(DevaptClassA.decorators.all_ordered.length,					0, 'DevaptClassA.decorators.all_ordered');
				
				// CHECK MIXINS REPOSITORY
				equal(Object.keys(DevaptClassB.mixins.all_map).length,				0, 'DevaptClassB.mixins.all_map');
				equal(DevaptClassB.mixins.all_ordered.length,						0, 'DevaptClassB.mixins.all_ordered');
				
				// CHECK METHODS REPOSITORY
				equal(Object.keys(DevaptClassB.methods.all_map).length,				4, 'DevaptClassB.methods.all_map');
				equal(DevaptClassB.methods.all_ordered.length,						4, 'DevaptClassB.methods.all_ordered');
				
				// CHECK PROPERTIES REPOSITORY
				equal(Object.keys(DevaptClassB.properties.all_map).length,			8, 'DevaptClassB.properties.all_map');
				equal(DevaptClassB.properties.all_ordered.length,					8, 'DevaptClassB.properties.all_ordered');
				equal(Object.keys(DevaptClassB.properties.own_map).length,			6, 'DevaptClassB.properties.own_map');
				equal(DevaptClassB.properties.own_ordered.length,					6, 'DevaptClassB.properties.own_ordered');
			}
		);
		
		
		test('DevaptClass check class instance objectB_1 of ClassB', 26,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(objectB_1), 'is_object(objectB_1)');
				equal(typeof(objectB_1), 'object', 'typeof(objectB_1) == object');
				equal(typeof(DevaptClassB), 'object', 'typeof(DevaptClassB) == object');
				
				ok(objectB_1.prototype == DevaptClassB.infos.proto, 'objectB_1.prototype == DevaptClassB.infos.proto');
				equal(objectB_1.class_name, DevaptClassB.infos.class_name, 'objectB_1.class_name = DevaptClassB.infos.class_name');
				
				ok(DevaptTypes.is_function(objectB_1.methodA_1), 'is_function(objectB_1.methodA_1)');
				ok(DevaptTypes.is_function(objectB_1.methodA_2), 'is_function(objectB_1.methodA_2)');
				ok(DevaptTypes.is_function(objectB_1.methodB_1), 'is_function(objectB_1.methodB_1)');
				ok(DevaptTypes.is_function(objectB_1.methodB_2), 'is_function(objectB_1.methodB_2)');
				
				equal(objectB_1.methodA_1(), 'DevaptClassB.methodA_1', 'objectB_1.methodA_1() result');
				equal(objectB_1.methodA_2(), 'DevaptClassB.methodA_2:no args', 'objectB_1.methodA_2() result');
				equal(objectB_1.methodB_1(), 'DevaptClassB.methodB_1', 'objectB_1.methodB_1() result');
				equal(objectB_1.methodB_2('a','b'), 'DevaptClassB.methodB_2:a:b', 'objectB_1.methodB_2() result');
				
				ok(DevaptTypes.is_integer(objectB_1.A_prop_1_int), 'is_integer(objectB_1.A_prop_1_int)');
				ok(DevaptTypes.is_string(objectB_1.A_prop_2_str), 'is_string(objectB_1.A_prop_2_str)');
				
				equal(objectB_1.A_prop_1_int, -1, 'objectB_1.A_prop_1_int = -1');
				equal(objectB_1.A_prop_2_str, 'abcdef', 'objectB_1.A_prop_2_str = abcdef');
				
				ok(DevaptTypes.is_array(objectB_1.B_prop_1_array), 'is_array(objectB_1.B_prop_1_array)');
				equal(objectB_1.B_prop_1_array.length, 3, 'objectB_1.B_prop_1_array.length = 3');
				equal(objectB_1.B_prop_1_array[0], '123', 'objectB_1.B_prop_1_array[0] = "123"');
				equal(objectB_1.B_prop_1_array[1], '456', 'objectB_1.B_prop_1_array[1] = "456"');
				equal(objectB_1.B_prop_1_array[2], '789', 'objectB_1.B_prop_1_array[2] = "789"');
				
				ok(DevaptTypes.is_object(objectB_1.B_prop_2_obj), 'is_object(objectB_1.B_prop_2_obj)');
				equal(Object.keys(objectB_1.B_prop_2_obj).length, 2, 'objectB_1.B_prop_2_obj.keys.length = 2');
				equal(objectB_1.B_prop_2_obj['attr1'], 'a', 'objectB_1.B_prop_2_obj[attr1] = "a"');
				equal(objectB_1.B_prop_2_obj['attr2'], 'b', 'objectB_1.B_prop_2_obj[attr2] = "b"');
			}
		);
		
		
		test('DevaptClass check class instance objectB_2 of ClassB', 26,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(objectB_2), 'is_object(objectB_2)');
				equal(typeof(objectB_2), 'object', 'typeof(objectB_2) == object');
				equal(typeof(DevaptClassB), 'object', 'typeof(DevaptClassB) == object');
				
				ok(objectB_2.prototype == DevaptClassB.infos.proto, 'objectB_2.prototype == DevaptClassB.infos.proto');
				equal(objectB_2.class_name, DevaptClassB.infos.class_name, 'objectB_2.class_name = DevaptClassB.infos.class_name');
				
				ok(DevaptTypes.is_function(objectB_2.methodA_1), 'is_function(objectB_2.methodA_1)');
				ok(DevaptTypes.is_function(objectB_2.methodA_2), 'is_function(objectB_2.methodA_2)');
				ok(DevaptTypes.is_function(objectB_2.methodB_1), 'is_function(objectB_2.methodB_1)');
				ok(DevaptTypes.is_function(objectB_2.methodB_2), 'is_function(objectB_2.methodB_2)');
				
				equal(objectB_2.methodA_1(), 'DevaptClassB.methodA_1', 'objectB_2.methodA_1() result');
				equal(objectB_2.methodA_2(), 'DevaptClassB.methodA_2:no args', 'objectB_2.methodA_2() result');
				equal(objectB_2.methodB_1(), 'DevaptClassB.methodB_1', 'objectB_2.methodB_1() result');
				equal(objectB_2.methodB_2('a','b'), 'DevaptClassB.methodB_2:a:b', 'objectB_2.methodB_2() result');
				
				ok(DevaptTypes.is_integer(objectB_2.A_prop_1_int), 'is_integer(objectB_2.A_prop_1_int)');
				ok(DevaptTypes.is_string(objectB_2.A_prop_2_str), 'is_string(objectB_2.A_prop_2_str)');
				
				equal(objectB_2.A_prop_1_int, 999, 'objectB_2.A_prop_1_int = 999');
				equal(objectB_2.A_prop_2_str, 'nameB_2 prop 2', 'objectB_2.A_prop_2_str = nameB_2 prop 2');
				
				ok(DevaptTypes.is_array(objectB_2.B_prop_1_array), 'is_array(objectB_2.B_prop_1_array)');
				equal(objectB_2.B_prop_1_array.length, 3, 'objectB_2.B_prop_1_array.length = 3');
				equal(objectB_2.B_prop_1_array[0], '123', 'objectB_2.B_prop_1_array[0] = "123"');
				equal(objectB_2.B_prop_1_array[1], '456', 'objectB_2.B_prop_1_array[1] = "456"');
				equal(objectB_2.B_prop_1_array[2], '789', 'objectB_2.B_prop_1_array[2] = "789"');
				
				ok(DevaptTypes.is_object(objectB_2.B_prop_2_obj), 'is_object(objectB_2.B_prop_2_obj)');
				equal(Object.keys(objectB_2.B_prop_2_obj).length, 2, 'objectB_2.B_prop_2_obj.keys.length = 2');
				equal(objectB_2.B_prop_2_obj['attr1'], 'a', 'objectB_2.B_prop_2_obj[attr1] = "a"');
				equal(objectB_2.B_prop_2_obj['attr2'], 'b', 'objectB_2.B_prop_2_obj[attr2] = "b"');
			}
		);
	}
	
	return run_tests;
} );	