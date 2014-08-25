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
		
		test('DevaptTypes.l/rpad', 2,
			function()
			{
				// equal(DevaptTypes.lpad(''),								'', 'DevaptTypes.rpad: ""');
				
				// equal(DevaptTypes.rpad(''),								'', 'DevaptTypes.rpad: ""');
			}
		);
	}
	
	return run_tests;
} );