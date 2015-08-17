/**
 * @file        core/inheritance.js
 * @desc        Devapt static inheritance features
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/traces', 'core/types', 'object/classes'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses)
{
	/**
	 * @memberof	DevaptInheritance
	 * @public
	 * @class
	 * @desc		Devapt inheritance features container
	 */
	var DevaptInheritance = function() {};
	
	
	/**
	 * @memberof	DevaptInheritance
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptInheritance.inheritance_trace = true;


	/**
	 * @memberof	DevaptInheritance
	 * @public
	 * @static
	 * @desc		Inheritance tree
	 */
	DevaptInheritance.inheritances = {};



	/**
	 * @memberof			DevaptInheritance
	 * @public
	 * @static
	 * @method				DevaptInheritance.get_inheritance(arg_class_proto, arg_class_proto_inherited)
	 * @desc				Get the inheritances array
	 * @return {array}		Array of object {current:class_proto, inherited: class_proto_inherited}
	 */
	DevaptInheritance.get_inheritances = function()
	{
		return DevaptInheritance.inheritances;
	};


	/**
	 * @memberof			DevaptInheritance
	 * @public
	 * @static
	 * @method				DevaptInheritance.get_inheritance(arg_class_proto, arg_class_proto_inherited)
	 * @desc				Get the classes names
	 * @return {array}		Array of string
	 */
	DevaptInheritance.get_classes = function()
	{
		return Object.keys( DevaptInheritance.inheritances );
	}



	/**
	 * @memberof			DevaptInheritance
	 * @public
	 * @static
	 * @method				DevaptInheritance.register_inheritance(arg_class_proto, arg_class_proto_inherited)
	 * @desc				Register an inheritance edge
	 * @param {object}		arg_class_proto				child class
	 * @param {object}		arg_class_proto_inherited	inherited class
	 * @return {nothing}
	 */
	DevaptInheritance.register_inheritance = function(arg_class_proto, arg_class_proto_inherited)
	{
		DevaptInheritance.inheritances[arg_class_proto.name] = {current:arg_class_proto, inherited: arg_class_proto_inherited};
	}


	/**
	 * @memberof			DevaptInheritance
	 * @public
	 * @static
	 * @method				DevaptInheritance.get_inherited_classes(arg_class_proto)
	 * @desc				Get all inherited classes
	 * @param {object}		arg_class_proto				class prototype
	 * @return {array}		inherited classes array
	 */
	DevaptInheritance.get_inherited_classes = function(arg_class_proto)
	{
		var context = 'DevaptInheritance.get_inherited_classes(class)';
		DevaptTraces.trace_enter(context, '', DevaptInheritance.inheritance_trace);
		
		
		var inherited_classes = [];
		var class_name = DevaptClasses.get_class_name(arg_class_proto);
		DevaptTraces.trace_var(context, 'class_name', class_name, DevaptInheritance.inheritance_trace);
		
		while( ! DevaptTypes.is_null( DevaptInheritance.inheritances[class_name] ) )
		{
			inherited_classes.push( DevaptInheritance.inheritances[class_name].inherited.name );
			class_name = DevaptInheritance.inheritances[class_name].inherited.name;
			DevaptTraces.trace_var(context, 'class_name', class_name, DevaptInheritance.inheritance_trace);
		}
		
		
		DevaptTraces.trace_leave(context, '', DevaptInheritance.inheritance_trace);
		return inherited_classes;
	}


	/**
	 * @memberof			DevaptInheritance
	 * @public
	 * @static
	 * @method				DevaptInheritance.test_inheritance(arg_class_proto, arg_class_proto_inherited)
	 * @desc				Test an inheritance
	 * @param {object}		arg_class_proto				class to test
	 * @param {object}		arg_class_proto_inherited	inherited class
	 * @return {boolean}
	 */
	DevaptInheritance.test_inheritance = function(arg_class_proto, arg_class_proto_inherited)
	{
		var context = 'DevaptInheritance.test_inheritance(proto,inherited proto)';
		DevaptTraces.trace_enter(context, '', DevaptInheritance.inheritance_trace);
		
		
		if ( DevaptTypes.is_null(arg_class_proto) || DevaptTypes.is_null(arg_class_proto_inherited) )
		{
			DevaptTraces.trace_leave(context, 'proto or inherited proto is null', DevaptInheritance.inheritance_trace);
			return false;
		}
		
		var class_name = null;
		if ( DevaptTypes.is_string(arg_class_proto) )
		{
			DevaptTraces.trace_step(context, 'proto is a string', DevaptInheritance.inheritance_trace);
			
			class_name = arg_class_proto;
			if (class_name == arg_class_proto_inherited.name)
			{
				DevaptTraces.trace_leave(context, 'inheritance is true', DevaptInheritance.inheritance_trace);
				return true;
			}
		}
		else
		{
			DevaptTraces.trace_step(context, 'proto is not a string', DevaptInheritance.inheritance_trace);
			
			if ( DevaptTypes.is_function(arg_class_proto) )
			{
				DevaptTraces.trace_step(context, 'proto is a function', DevaptInheritance.inheritance_trace);
				
				if (arg_class_proto == arg_class_proto_inherited)
				{
					DevaptTraces.trace_leave(context, 'inheritance is true', DevaptInheritance.inheritance_trace);
					return true;
				}
				
				class_name = arg_class_proto.name;
			}
			else
			{
				DevaptTraces.trace_step(context, 'proto is not a function', DevaptInheritance.inheritance_trace);
				
				if ( ! DevaptTypes.is_object(arg_class_proto) )
				{
					DevaptTraces.trace_step(context, 'proto is not an object', DevaptInheritance.inheritance_trace);
					
					DevaptTraces.trace_leave(context, 'inheritance is false', DevaptInheritance.inheritance_trace);
					return false
				}
				
				DevaptTraces.trace_step(context, 'proto is an object', DevaptInheritance.inheritance_trace);
				
				if (arg_class_proto.class_name == arg_class_proto_inherited.name || arg_class_proto instanceof arg_class_proto_inherited)
				{
					DevaptTraces.trace_leave(context, 'inheritance is true', DevaptInheritance.inheritance_trace);
					return true;
				}
				
				class_name = arg_class_proto.class_name;
			}
		}
		
		DevaptTraces.trace_step(context, 'get inheritance record', DevaptInheritance.inheritance_trace);
		var record = DevaptInheritance.inheritances[class_name];
		if ( DevaptTypes.is_null(record) )
		{
			DevaptTraces.trace_leave(context, 'inheritance is false', DevaptInheritance.inheritance_trace);
			return false;
		}
		
		if (record.inherited == arg_class_proto_inherited)
		{
			DevaptTraces.trace_leave(context, 'inheritance is true', DevaptInheritance.inheritance_trace);
			return true;
		}
		
		var result = DevaptInheritance.test_inheritance(record.inherited, arg_class_proto_inherited);
		
		
		DevaptTraces.trace_leave(context, 'inheritance is ' + (result ? 'true' : 'false'), DevaptInheritance.inheritance_trace);
		return result;
	}


	/**
	 * @memberof			DevaptInheritance
	 * @public
	 * @static
	 * @method				DevaptInheritance.is_a(arg_class_proto, arg_class_proto_inherited)
	 * @desc				Test an inheritance (alias of test_inheritance)
	 * @param {object}		arg_class_proto				class to test
	 * @param {object}		arg_class_proto_inherited	inherited class
	 * @return {boolean}
	 */
	DevaptInheritance.is_a = function(arg_class_proto, arg_class_proto_inherited)
	{
		return DevaptInheritance.test_inheritance(arg_class_proto, arg_class_proto_inherited);
	}
	
	
	return DevaptInheritance;
} );