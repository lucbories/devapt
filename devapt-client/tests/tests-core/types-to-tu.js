/**
 * @file        types-to-tu.js
 * @desc        Devapt types conversion tests unit
 * @ingroup     LIBAPT_CORE
 * @date        2014-08-14
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types'],
function(Devapt, DevaptTraces, DevaptTypes)
{
	console.log('Load qUnit test for DevaptTypes (to)');
	
	function run_tests()
	{
		console.log('Running qUnit test for DevaptTypes');
		
		test('DevaptTypes.get_value_str', 4+4+5+4,
			function()
			{
				var o1 = {};
				var o2 = {'a':null};
				var o3 = {'a':null, 'b':123};
				var o4 = {null:'123'};
				
				var a1 = [];
				var a2 = [123];
				var a3 = ['123', 456];
				var a4 = [null];
				var a5 = [123, null];
				
				equal(DevaptTypes.get_value_str(null),					'null', 'DevaptTypes.get_value_str: null');
				equal(DevaptTypes.get_value_str(undefined),				'null', 'DevaptTypes.get_value_str: undefined');
				equal(DevaptTypes.get_value_str(123),					'123', 'DevaptTypes.get_value_str: 123');
				equal(DevaptTypes.get_value_str('123'),					'123', 'DevaptTypes.get_value_str: "123"');
				
				equal(DevaptTypes.get_value_str(o1),					'{}', 'DevaptTypes.get_value_str: o1');
				equal(DevaptTypes.get_value_str(o2),					'{\n  a=null\n}', 'DevaptTypes.get_value_str: o2');
				equal(DevaptTypes.get_value_str(o3),					'{\n  a=null\n  b=123\n}', 'DevaptTypes.get_value_str: o3');
				equal(DevaptTypes.get_value_str(o4),					'{\n  null=123\n}', 'DevaptTypes.get_value_str: o4');
				
				equal(DevaptTypes.get_value_str(a1),					'[]', 'DevaptTypes.get_value_str: a1');
				equal(DevaptTypes.get_value_str(a2),					'[0=123]', 'DevaptTypes.get_value_str: a2');
				equal(DevaptTypes.get_value_str(a3),					'[0=123,1=456]', 'DevaptTypes.get_value_str: a3');
				equal(DevaptTypes.get_value_str(a4),					'[0=null]', 'DevaptTypes.get_value_str: a4');
				equal(DevaptTypes.get_value_str(a5),					'[0=123,1=null]', 'DevaptTypes.get_value_str: a5');
				
				equal(DevaptTypes.get_value_str(o1),					'{}', 'DevaptTypes.get_value_str: o1');
				equal(DevaptTypes.get_value_str(o2),					'{\n  a=null\n}', 'DevaptTypes.get_value_str: o2');
				equal(DevaptTypes.get_value_str(o3),					'{\n  a=null\n  b=123\n}', 'DevaptTypes.get_value_str: o3');
				equal(DevaptTypes.get_value_str(o4),					'{\n  null=123\n}', 'DevaptTypes.get_value_str: o4');
			}
		);
		
		
		test('DevaptTypes.to_string', 5,
			function()
			{
				var o3 = {'a':null, 'b':123};
				
				equal(DevaptTypes.to_string(''),						'', 'DevaptTypes.to_string: ""');
				equal(DevaptTypes.to_string('123'),						'123', 'DevaptTypes.to_string: "123"');
				equal(DevaptTypes.to_string(123),						'', 'DevaptTypes.to_string: 123');
				equal(DevaptTypes.to_string(123, 'default'),			'default', 'DevaptTypes.to_string: 123,"default"');
				equal(DevaptTypes.to_string(o3, 'default'),				'default', 'DevaptTypes.to_string: o3,default');
			}
		);
		
		
		test('DevaptTypes.to_boolean', 3+15+15+6,
			function()
			{
				equal(DevaptTypes.to_boolean(null),						false, 'DevaptTypes.to_boolean: null');
				equal(DevaptTypes.to_boolean(undefined),				false, 'DevaptTypes.to_boolean: undefined');
				equal(DevaptTypes.to_boolean(''),						false, 'DevaptTypes.to_boolean: ""');
				
				equal(DevaptTypes.to_boolean(true),						true, 'DevaptTypes.to_boolean: true');
				equal(DevaptTypes.to_boolean(1),						true, 'DevaptTypes.to_boolean: 1');
				equal(DevaptTypes.to_boolean(11),						true, 'DevaptTypes.to_boolean: 11');
				equal(DevaptTypes.to_boolean('1'),						true, 'DevaptTypes.to_boolean: "1"');
				equal(DevaptTypes.to_boolean('true'),					true, 'DevaptTypes.to_boolean: "true"');
				equal(DevaptTypes.to_boolean('True'),					true, 'DevaptTypes.to_boolean: "True"');
				equal(DevaptTypes.to_boolean('TRUE'),					true, 'DevaptTypes.to_boolean: "TRUE"');
				equal(DevaptTypes.to_boolean('y'),						true, 'DevaptTypes.to_boolean: "y"');
				equal(DevaptTypes.to_boolean('Y'),						true, 'DevaptTypes.to_boolean: "Y"');
				equal(DevaptTypes.to_boolean('yes'),					true, 'DevaptTypes.to_boolean: "yes"');
				equal(DevaptTypes.to_boolean('Yes'),					true, 'DevaptTypes.to_boolean: "Yes"');
				equal(DevaptTypes.to_boolean('YES'),					true, 'DevaptTypes.to_boolean: "YES"');
				equal(DevaptTypes.to_boolean('on'),						true, 'DevaptTypes.to_boolean: "on"');
				equal(DevaptTypes.to_boolean('On'),						true, 'DevaptTypes.to_boolean: "On"');
				equal(DevaptTypes.to_boolean('ON'),						true, 'DevaptTypes.to_boolean: "ON"');
				
				equal(DevaptTypes.to_boolean(false),					false, 'DevaptTypes.to_boolean: false');
				equal(DevaptTypes.to_boolean(0),						false, 'DevaptTypes.to_boolean: 0');
				equal(DevaptTypes.to_boolean(-1),						false, 'DevaptTypes.to_boolean: -1');
				equal(DevaptTypes.to_boolean('0'),						false, 'DevaptTypes.to_boolean: "0"');
				equal(DevaptTypes.to_boolean('false'),					false, 'DevaptTypes.to_boolean: "false"');
				equal(DevaptTypes.to_boolean('False'),					false, 'DevaptTypes.to_boolean: "False"');
				equal(DevaptTypes.to_boolean('FALSE'),					false, 'DevaptTypes.to_boolean: "FALSE"');
				equal(DevaptTypes.to_boolean('n'),						false, 'DevaptTypes.to_boolean: "n"');
				equal(DevaptTypes.to_boolean('N'),						false, 'DevaptTypes.to_boolean: "N"');
				equal(DevaptTypes.to_boolean('no'),						false, 'DevaptTypes.to_boolean: "no"');
				equal(DevaptTypes.to_boolean('No'),						false, 'DevaptTypes.to_boolean: "No"');
				equal(DevaptTypes.to_boolean('NO'),						false, 'DevaptTypes.to_boolean: "NO"');
				equal(DevaptTypes.to_boolean('off'),					false, 'DevaptTypes.to_boolean: "off"');
				equal(DevaptTypes.to_boolean('Off'),					false, 'DevaptTypes.to_boolean: "Off"');
				equal(DevaptTypes.to_boolean('OFF'),					false, 'DevaptTypes.to_boolean: "OFF"');
				
				equal(DevaptTypes.to_boolean('xyz'),					false, 'DevaptTypes.to_boolean: "xyz"');
				equal(DevaptTypes.to_boolean(true, 456),				true, 'DevaptTypes.to_boolean: true,456');
				equal(DevaptTypes.to_boolean(false, 456),				false, 'DevaptTypes.to_boolean: false,456');
				equal(DevaptTypes.to_boolean('xyz', 456),				false, 'DevaptTypes.to_boolean: "xyz",456');
				equal(DevaptTypes.to_boolean(['xyz'], 456),				true, 'DevaptTypes.to_boolean: ["xyz"],456');
				equal(DevaptTypes.to_boolean({a:'xyz'}, 0),				false, 'DevaptTypes.to_boolean: {a:"xyz"},0');
			}
		);
		
		
		test('DevaptTypes.to_number', 4+4+8,
			function()
			{
				equal(DevaptTypes.to_number(null),						0, 'DevaptTypes.to_number: null');
				equal(DevaptTypes.to_number(undefined),					0, 'DevaptTypes.to_number: undefined');
				equal(DevaptTypes.to_number(''),						0, 'DevaptTypes.to_number: ""');
				equal(DevaptTypes.to_number('xyz'),						0, 'DevaptTypes.to_number: "xyz"');
				
				equal(DevaptTypes.to_number(null,456),					456, 'DevaptTypes.to_number: null,456');
				equal(DevaptTypes.to_number(undefined,456),				456, 'DevaptTypes.to_number: undefined,456');
				equal(DevaptTypes.to_number('',456),					456, 'DevaptTypes.to_number: "",456');
				equal(DevaptTypes.to_number('xyz',456),					456, 'DevaptTypes.to_number: "xyz",456');
				
				equal(DevaptTypes.to_number(true),						1, 'DevaptTypes.to_number: true');
				equal(DevaptTypes.to_number(false),						0, 'DevaptTypes.to_number: false');
				equal(DevaptTypes.to_number(1),							1, 'DevaptTypes.to_number: 1');
				equal(DevaptTypes.to_number(11),						11, 'DevaptTypes.to_number: 11');
				equal(DevaptTypes.to_number('1'),						1, 'DevaptTypes.to_number: "1"');
				equal(DevaptTypes.to_number('-1'),						-1, 'DevaptTypes.to_number: "-1"');
				equal(DevaptTypes.to_number(1.1),						1.1, 'DevaptTypes.to_number: 1.1');
				equal(DevaptTypes.to_number("1.1"),						1.1, 'DevaptTypes.to_number: "1.1"');
			}
		);
		
		
		test('DevaptTypes.to_integer', 4+4+8,
			function()
			{
				equal(DevaptTypes.to_integer(null),						0, 'DevaptTypes.to_integer: null');
				equal(DevaptTypes.to_integer(undefined),				0, 'DevaptTypes.to_integer: undefined');
				equal(DevaptTypes.to_integer(''),						0, 'DevaptTypes.to_integer: ""');
				equal(DevaptTypes.to_integer('xyz'),					0, 'DevaptTypes.to_integer: "xyz"');
				
				equal(DevaptTypes.to_integer(null,456),					456, 'DevaptTypes.to_integer: null,456');
				equal(DevaptTypes.to_integer(undefined,456),			456, 'DevaptTypes.to_integer: undefined,456');
				equal(DevaptTypes.to_integer('',456),					456, 'DevaptTypes.to_integer: "",456');
				equal(DevaptTypes.to_integer('xyz',456),				456, 'DevaptTypes.to_integer: "xyz",456');
				
				equal(DevaptTypes.to_integer(true),						1, 'DevaptTypes.to_integer: true');
				equal(DevaptTypes.to_integer(false),					0, 'DevaptTypes.to_integer: false');
				equal(DevaptTypes.to_integer(1),						1, 'DevaptTypes.to_integer: 1');
				equal(DevaptTypes.to_integer(11),						11, 'DevaptTypes.to_integer: 11');
				equal(DevaptTypes.to_integer('1'),						1, 'DevaptTypes.to_integer: "1"');
				equal(DevaptTypes.to_integer('-1'),						-1, 'DevaptTypes.to_integer: "-1"');
				equal(DevaptTypes.to_integer(1.1),						1, 'DevaptTypes.to_integer: 1.1');
				equal(DevaptTypes.to_integer("1.1"),					1, 'DevaptTypes.to_integer: "1.1"');
			}
		);
		
		
		test('DevaptTypes.to_float', 4+4+8,
			function()
			{
				equal(DevaptTypes.to_float(null),						0.0, 'DevaptTypes.to_float: null');
				equal(DevaptTypes.to_float(undefined),					0.0, 'DevaptTypes.to_float: undefined');
				equal(DevaptTypes.to_float(''),							0.0, 'DevaptTypes.to_float: ""');
				equal(DevaptTypes.to_float('xyz'),						0.0, 'DevaptTypes.to_float: "xyz"');
				
				equal(DevaptTypes.to_float(null,456),					456.0, 'DevaptTypes.to_float: null,456');
				equal(DevaptTypes.to_float(undefined,456),				456.0, 'DevaptTypes.to_float: undefined,456');
				equal(DevaptTypes.to_float('',456),						456.0, 'DevaptTypes.to_float: "",456');
				equal(DevaptTypes.to_float('xyz',456),					456.0, 'DevaptTypes.to_float: "xyz",456');
				
				equal(DevaptTypes.to_float(true),						0.0, 'DevaptTypes.to_float: true');
				equal(DevaptTypes.to_float(false),						0.0, 'DevaptTypes.to_float: false');
				equal(DevaptTypes.to_float(1),							1.0, 'DevaptTypes.to_float: 1');
				equal(DevaptTypes.to_float(11),							11.0, 'DevaptTypes.to_float: 11');
				equal(DevaptTypes.to_float('1'),						1.0, 'DevaptTypes.to_float: "1"');
				equal(DevaptTypes.to_float('-1'),						-1.0, 'DevaptTypes.to_float: "-1"');
				equal(DevaptTypes.to_float(1.1),						1.1, 'DevaptTypes.to_float: 1.1');
				equal(DevaptTypes.to_float("1.1"),						1.1, 'DevaptTypes.to_float: "1.1"');
			}
		);
		
		
		test('DevaptTypes.to_date', 5+4+4,
			function()
			{
				var today = new Date().toLocaleDateString();
				var date1 = new Date(2014, 9-1, 1).toLocaleDateString();
				var date2 = new Date(1).toLocaleDateString();
				var date3 = new Date(11).toLocaleDateString();
				
				equal(DevaptTypes.to_date(null),						today, 'DevaptTypes.to_date: null');
				equal(DevaptTypes.to_date(null, date1),					date1, 'DevaptTypes.to_date: null,date1');
				equal(DevaptTypes.to_date(undefined),					today, 'DevaptTypes.to_date: undefined');
				equal(DevaptTypes.to_date(''),							today, 'DevaptTypes.to_date: ""');
				equal(DevaptTypes.to_date('xyz'),						today, 'DevaptTypes.to_date: "xyz"');
				
				equal(DevaptTypes.to_date(null,date1),					date1, 'DevaptTypes.to_date: null,date1');
				equal(DevaptTypes.to_date(undefined,date1),				date1, 'DevaptTypes.to_date: undefined,date1');
				equal(DevaptTypes.to_date('',date1),					date1, 'DevaptTypes.to_date: "",date1');
				equal(DevaptTypes.to_date('xyz',date1),					date1, 'DevaptTypes.to_date: "xyz",date1');
				
				equal(DevaptTypes.to_date(true),						today, 'DevaptTypes.to_date: true');
				equal(DevaptTypes.to_date(false),						today, 'DevaptTypes.to_date: false');
				equal(DevaptTypes.to_date(1),							date2, 'DevaptTypes.to_date: 1');
				equal(DevaptTypes.to_date(11),							date3, 'DevaptTypes.to_date: 11');
			}
		);
		
		
		test('DevaptTypes.to_time', 1,
			function()
			{
				equal(DevaptTypes.to_time(''),							'', 'DevaptTypes.to_time: ""');
			}
		);
		
		
		test('DevaptTypes.to_datetime', 1,
			function()
			{
				equal(DevaptTypes.to_datetime(''),						'', 'DevaptTypes.to_datetime: ""');
			}
		);
		
		
		test('DevaptTypes.to_array', 1,
			function()
			{
				equal(DevaptTypes.to_array(''),							'', 'DevaptTypes.to_array: ""');
			}
		);
		
		
		test('DevaptTypes.to_object', 1,
			function()
			{
				equal(DevaptTypes.to_object(''),						'', 'DevaptTypes.to_object: ""');
			}
		);
		
		
		test('DevaptTypes.to_callback', 1,
			function()
			{
				equal(DevaptTypes.to_callback(''),						'', 'DevaptTypes.to_callback: ""');
			}
		);
	}
	
	return run_tests;
} );