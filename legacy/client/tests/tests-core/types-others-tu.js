/**
 * @file        types-others-tu.js
 * @desc        Devapt types others tests unit
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
	console.log('Load qUnit test for DevaptTypes (others)');
	
	function run_tests()
	{
		console.log('Running qUnit test for DevaptTypes');
		
		
		test('DevaptTypes clone', 14,
			function()
			{
				var a = {};
				var b = {};
				var c = DevaptTypes.clone_object(a);
				
				ok( typeof a === 'object', 'clone_object: a is object');
				ok(DevaptTypes.is_empty_object(a), 'clone_object: is_empty_object(a)');
				
				// equal(a,		b, 'clone_object: a=b');
				ok(DevaptTypes.is_empty_object(b), 'clone_object: is_empty_object(b)');
				
				// equal(a,		c, 'clone_object: a=c');
				ok(DevaptTypes.is_empty_object(c), 'clone_object: is_empty_object(c)');
				
				a.p1 = 'p1';
				a.p2 = 'p2';
				ok(DevaptTypes.is_string(a.p1),	'clone_object: a.p1 is a string');
				ok(DevaptTypes.is_string(a.p2),	'clone_object: a.p2 is a string');
				equal(a.p1,		'p1', 'clone_object: a.p1=p1');
				equal(a.p2,		'p2', 'clone_object: a.p2=p2');
				
				var d = DevaptTypes.clone_object(a);
				ok(DevaptTypes.is_string(d.p1),	'clone_object: d.p1 is a string');
				ok(DevaptTypes.is_string(d.p2),	'clone_object: d.p2 is a string');
				equal(d.p1,		'p1', 'clone_object: d.p1=p1');
				equal(d.p2,		'p2', 'clone_object: d.p2=p2');
				
				a.p1='hello';
				equal(a.p1,		'hello', 'clone_object: a.p1=hello');
				equal(d.p1,		'p1', 'clone_object: d.p1=p1');
			}
		);
		
		
		// TODO 
/*	test('DevaptTypes.l/rpad', 2,
			function()
			{
				// equal(DevaptTypes.lpad(''),								'', 'DevaptTypes.rpad: ""');
				
				// equal(DevaptTypes.rpad(''),								'', 'DevaptTypes.rpad: ""');
			}
		);*/
	}
	
	return run_tests;
} );