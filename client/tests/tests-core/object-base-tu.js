/**
 * @file        object-base-tu.js
 * @desc        Devapt class tests unit
 * @ingroup     LIBAPT_CORE
 * @date        2014-12-06
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/class', 'core/object-base'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClass, DevaptObjectBase)
{
	console.log('Load qUnit test for DevaptObjectBase');
	
	var jQuery = Devapt.jQuery();
	
	
	// DECLARE CLASS A
	var settings_A = {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-01',
			'updated':'2014-11-01',
			'description':'Class A.'
		}
	};
	var DevaptClassA = new DevaptClass('DevaptClassA', DevaptObjectBase, settings_A);
	
	DevaptClassA.build_class();
	// console.log(DevaptClassA, 'DevaptClassA');
	
	
	// CREATE INSTANCES OF CLASS BASE
	var objectBase_1 = DevaptObjectBase.create('nameBase_1');
	console.log(objectBase_1, 'objectBase_1');
	
	// CREATE INSTANCES OF CLASS A
	var objectA_1 = DevaptClassA.create('nameA_1');
	console.log(objectA_1, 'objectA_1');
	
	
	function run_tests()
	{
		console.log('Running qUnit test for DevaptObjectBase');
		
		test('Check DevaptObjectBase class', 11,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(DevaptObjectBase.infos), 'DevaptObjectBase.infos');
				equal(DevaptObjectBase.infos.class_name,		'DevaptObjectBase', 'DevaptObjectBase.infos.class_name');
				
				// CHECK STATIC METHODS
				// ok(DevaptTypes.is_function(DevaptObjectBase.trace_info), 'DevaptObjectBase.trace_info');
				// ok(DevaptTypes.is_function(DevaptObjectBase.trace_warn), 'DevaptObjectBase.trace_warn');
				// ok(DevaptTypes.is_function(DevaptObjectBase.trace_enter), 'DevaptObjectBase.trace_enter');
				// ok(DevaptTypes.is_function(DevaptObjectBase.trace_separator), 'DevaptObjectBase.trace_separator');
				// ok(DevaptTypes.is_function(DevaptObjectBase.trace_step), 'DevaptObjectBase.trace_step');
				// ok(DevaptTypes.is_function(DevaptObjectBase.trace_leave), 'DevaptObjectBase.trace_leave');
				// ok(DevaptTypes.is_function(DevaptObjectBase.trace_error), 'DevaptObjectBase.trace_error');
				// ok(DevaptTypes.is_function(DevaptObjectBase.trace_var), 'DevaptObjectBase.trace_var');
				// ok(DevaptTypes.is_function(DevaptObjectBase.trace_value), 'DevaptObjectBase.trace_value');
				
				// CHECK NON STATIC METHODS
				ok(DevaptTypes.is_function(DevaptObjectBase.infos.proto.enter), 'DevaptObjectBase.infos.enter');
				ok(DevaptTypes.is_function(DevaptObjectBase.infos.proto.step), 'DevaptObjectBase.infos.step');
				ok(DevaptTypes.is_function(DevaptObjectBase.infos.proto.info), 'DevaptObjectBase.infos.info');
				ok(DevaptTypes.is_function(DevaptObjectBase.infos.proto.warn), 'DevaptObjectBase.infos.warn');
				ok(DevaptTypes.is_function(DevaptObjectBase.infos.proto.leave), 'DevaptObjectBase.infos.leave');
				ok(DevaptTypes.is_function(DevaptObjectBase.infos.proto.leave_or_error), 'DevaptObjectBase.infos.leave_or_error');
				ok(DevaptTypes.is_function(DevaptObjectBase.infos.proto.error), 'DevaptObjectBase.infos.error');
				ok(DevaptTypes.is_function(DevaptObjectBase.infos.proto.value), 'DevaptObjectBase.infos.value');
				ok(DevaptTypes.is_function(DevaptObjectBase.infos.proto.separator), 'DevaptObjectBase.infos.separator');
			}
		);
		
		test('Check DevaptObjectBase instance', 13,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(objectBase_1), 'is_object(objectBase_1)');
				equal(objectBase_1.name,		'nameBase_1', 'objectBase_1.name');
				
				// CHECK METHODS
				// ok(DevaptTypes.is_function(objectBase_1.trace_info), 'DevaptObjectBase.trace_info');
				// ok(DevaptTypes.is_function(objectBase_1.trace_warn), 'DevaptObjectBase.trace_warn');
				// ok(DevaptTypes.is_function(objectBase_1.trace_enter), 'DevaptObjectBase.trace_enter');
				// ok(DevaptTypes.is_function(objectBase_1.trace_separator), 'DevaptObjectBase.trace_separator');
				// ok(DevaptTypes.is_function(objectBase_1.trace_step), 'DevaptObjectBase.trace_step');
				// ok(DevaptTypes.is_function(objectBase_1.trace_leave), 'DevaptObjectBase.trace_leave');
				// ok(DevaptTypes.is_function(objectBase_1.trace_error), 'DevaptObjectBase.trace_error');
				// ok(DevaptTypes.is_function(objectBase_1.trace_var), 'DevaptObjectBase.trace_var');
				// ok(DevaptTypes.is_function(objectBase_1.trace_value), 'DevaptObjectBase.trace_value');
				
				ok(DevaptTypes.is_function(objectBase_1.assert), 'DevaptObjectBase.assert');
				
				ok(DevaptTypes.is_function(objectBase_1.do_callback), 'DevaptObjectBase.do_callback');
				
				ok(DevaptTypes.is_function(objectBase_1.enter), 'DevaptObjectBase.enter');
				ok(DevaptTypes.is_function(objectBase_1.step), 'DevaptObjectBase.step');
				ok(DevaptTypes.is_function(objectBase_1.info), 'DevaptObjectBase.info');
				ok(DevaptTypes.is_function(objectBase_1.warn), 'DevaptObjectBase.warn');
				ok(DevaptTypes.is_function(objectBase_1.leave), 'DevaptObjectBase.leave');
				ok(DevaptTypes.is_function(objectBase_1.leave_or_error), 'DevaptObjectBase.leave_or_error');
				ok(DevaptTypes.is_function(objectBase_1.error), 'DevaptObjectBase.error');
				ok(DevaptTypes.is_function(objectBase_1.value), 'DevaptObjectBase.value');
				ok(DevaptTypes.is_function(objectBase_1.separator), 'DevaptObjectBase.separator');
			}
		);
	}
	
	return run_tests;
} );	