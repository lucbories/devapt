/**
 * @file        object/factory.js
 * @desc        Devapt factory template
 * @ingroup     DEVAPT_OBJECT
 * @date        2015-01-29
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/traces'],
function(Devapt, DevaptTraces)
{
	/**
	 * @memberof	DevaptFactory
	 * @public
	 * @class
	 * @desc		Devapt factory container
	 */
	var DevaptFactory = function() {};
	
	
	/**
	 * @memberof	DevaptFactory
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptFactory.factory_trace = false;
	
	
	
	/**
	 * @memberof				DevaptFactory
	 * @public
	 * @static
	 * @method					DevaptFactory.get_class_require(arg_class_name)
	 * @desc					Get resource dependencies
	 * @param {string}			arg_class_name		resource class name
	 * @param {string}			arg_backend_path	backend relative path
	 * @return {array}			array of require file paths
	 */
	DevaptFactory.get_class_require = function(arg_class_name, arg_backend_path)
	{
		var context = 'DevaptFactory.get_class_require(class name,path)';
		DevaptTraces.trace_enter(context, '', DevaptFactory.factory_trace);
		
		
		
		
		DevaptTraces.trace_leave(context, Devapt.msg_default_empty_implementation, DevaptFactory.factory_trace);
		return [];
	}
	
	
	return DevaptFactory;
} );