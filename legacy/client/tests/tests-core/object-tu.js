/**
 * @file        object-tu.js
 * @desc        Devapt class tests unit
 * @ingroup     LIBAPT_CORE
 * @date        2014-12-06
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/class', 'core/object'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClass, DevaptObject)
{
	console.log('Load qUnit test for DevaptObject');
	
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
	var DevaptClassA = new DevaptClass('DevaptClassA', DevaptObject, settings_A);
	
	DevaptClassA.build_class();
	// console.log(DevaptClassA, 'DevaptClassA');
	
	
	// CREATE INSTANCES OF CLASS BASE
	var object_1 = DevaptObject.create('name_1');
	// console.log(object_1, 'object_1');
	
	// CREATE INSTANCES OF CLASS A
	var objectA_1 = DevaptClassA.create('nameA_1');
	// console.log(objectA_1, 'objectA_1');
	
	
	function run_tests()
	{
		console.log('Running qUnit test for DevaptObject');
		
		test('Check DevaptObject class', 15,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(DevaptObject.infos), 'DevaptObject.infos');
				equal(DevaptObject.infos.class_name,		'DevaptObject', 'DevaptObject.infos.class_name');
				
				// CHECK STATIC METHODS
				// ok(DevaptTypes.is_function(DevaptObject.trace_info), 'DevaptObject.trace_info');
				// ok(DevaptTypes.is_function(DevaptObject.trace_warn), 'DevaptObject.trace_warn');
				// ok(DevaptTypes.is_function(DevaptObject.trace_enter), 'DevaptObject.trace_enter');
				// ok(DevaptTypes.is_function(DevaptObject.trace_separator), 'DevaptObject.trace_separator');
				// ok(DevaptTypes.is_function(DevaptObject.trace_step), 'DevaptObject.trace_step');
				// ok(DevaptTypes.is_function(DevaptObject.trace_leave), 'DevaptObject.trace_leave');
				// ok(DevaptTypes.is_function(DevaptObject.trace_error), 'DevaptObject.trace_error');
				// ok(DevaptTypes.is_function(DevaptObject.trace_var), 'DevaptObject.trace_var');
				// ok(DevaptTypes.is_function(DevaptObject.trace_value), 'DevaptObject.trace_value');
				
				// CHECK NON STATIC METHODS
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.enter), 'DevaptObject.infos.enter');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.step), 'DevaptObject.infos.step');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.info), 'DevaptObject.infos.info');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.warn), 'DevaptObject.infos.warn');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.leave), 'DevaptObject.infos.leave');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.leave_or_error), 'DevaptObject.infos.leave_or_error');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.error), 'DevaptObject.infos.error');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.value), 'DevaptObject.infos.value');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.separator), 'DevaptObject.infos.separator');
				
				// CHECK METHODS FOR EVENTS LISTENING MIXIN
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.has_event_callback), 'DevaptObject.infos.proto.has_event_callback');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.add_event_callback), 'DevaptObject.infos.proto.add_event_callback');
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.remove_event_callback), 'DevaptObject.infos.proto.remove_event_callback');
				
				// CHECK METHODS FOR EVENTS SENDING MIXIN
				ok(DevaptTypes.is_function(DevaptObject.infos.proto.fire_event), 'DevaptObject.infos.proto.fire_event');
			}
		);
		
		test('Check DevaptObject instance', 17,
			function()
			{
				// CHECK INFOS
				ok(DevaptTypes.is_object(object_1), 'is_object(object_1)');
				equal(object_1.name,		'name_1', 'object_1.name');
				
				// CHECK STATIC METHODS FOR TRACEG MIXIN
				// ok(DevaptTypes.is_function(object_1.trace_info), 'object_1.trace_info');
				// ok(DevaptTypes.is_function(object_1.trace_warn), 'object_1.trace_warn');
				// ok(DevaptTypes.is_function(object_1.trace_enter), 'object_1.trace_enter');
				// ok(DevaptTypes.is_function(object_1.trace_separator), 'object_1.trace_separator');
				// ok(DevaptTypes.is_function(object_1.trace_step), 'object_1.trace_step');
				// ok(DevaptTypes.is_function(object_1.trace_leave), 'object_1.trace_leave');
				// ok(DevaptTypes.is_function(object_1.trace_error), 'object_1.trace_error');
				// ok(DevaptTypes.is_function(object_1.trace_var), 'object_1.trace_var');
				// ok(DevaptTypes.is_function(object_1.trace_value), 'object_1.trace_value');
				
				// CHECK NON STATIC METHODS FOR ASSERTION MIXIN
				ok(DevaptTypes.is_function(object_1.assert), 'object_1.assert');
				
				// CHECK NON STATIC METHODS FOR CALLBACK MIXIN
				ok(DevaptTypes.is_function(object_1.do_callback), 'object_1.do_callback');
				
				// CHECK NON STATIC METHODS FOR TRACE MIXIN
				ok(DevaptTypes.is_function(object_1.enter), 'object_1.enter');
				ok(DevaptTypes.is_function(object_1.step), 'object_1.step');
				ok(DevaptTypes.is_function(object_1.info), 'object_1.info');
				ok(DevaptTypes.is_function(object_1.warn), 'object_1.warn');
				ok(DevaptTypes.is_function(object_1.leave), 'object_1.leave');
				ok(DevaptTypes.is_function(object_1.leave_or_error), 'object_1.leave_or_error');
				ok(DevaptTypes.is_function(object_1.error), 'object_1.error');
				ok(DevaptTypes.is_function(object_1.value), 'object_1.value');
				ok(DevaptTypes.is_function(object_1.separator), 'object_1.separator');
				
				// CHECK METHODS FOR EVENTS LISTENING MIXIN
				ok(DevaptTypes.is_function(object_1.has_event_callback), 'object_1.has_event_callback');
				ok(DevaptTypes.is_function(object_1.add_event_callback), 'object_1.add_event_callback');
				ok(DevaptTypes.is_function(object_1.remove_event_callback), 'object_1.remove_event_callback');
				
				// CHECK METHODS FOR EVENTS SENDING MIXIN
				ok(DevaptTypes.is_function(object_1.fire_event), 'object_1.fire_event');
			}
		);
	}
	
	return run_tests;
} );	