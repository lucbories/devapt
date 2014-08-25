/**
 * @file        core/options-base.js
 * @desc        Devapt static object options features (base)
 * @ingroup     DEVAPT_CORE
 * @date        2014-08-14
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/classes', 'core/inheritance'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses, DevaptInheritance)
{
	/**
	 * @memberof	DevaptOptions
	 * @public
	 * @class
	 * @desc		Devapt options features container
	 */
	var DevaptOptions = function() {};
	
	/**
	 * @memberof	DevaptOptions
	 * @public
	 * @static
	 * @desc		Options trace enabled flag for register operation
	 */
	DevaptOptions.options_register_trace = false;


	/**
	 * @memberof	DevaptOptions
	 * @public
	 * @static
	 * @desc		Options trace enabled flag for get operation
	 */
	DevaptOptions.options_get_trace = false;


	/**
	 * @memberof	DevaptOptions
	 * @public
	 * @static
	 * @desc		Options trace enabled flag for set operation
	 */
	DevaptOptions.options_set_trace = false;


	/**
	 * @memberof	DevaptOptions
	 * @public
	 * @static
	 * @desc		Options tree
	 */
	DevaptOptions.options = {};

	/**
	 * @memberof	DevaptOptions
	 * @public
	 * @static
	 * @desc		Required options counters
	 */
	DevaptOptions.options_required = {};


	/**
	 * @memberof	DevaptOptions
	 * @public
	 * @static
	 * @desc		Options types array
	 */
	DevaptOptions.options_types = ['Boolean','Integer','Float','Date','Time','DateTime','Callback','String','Object','Array','QueryFilter','QueryMode','ViewLink'];


	/**
	 * @memberof	DevaptOptions
	 * @public
	 * @static
	 * @desc		Option sample object
	 */
	DevaptOptions.options_sample =
		{
			name: 'option name',
			type: 'option type',
			aliases: ['name alias 1', 'name alias 2'],
			default_value: '...',
			array_separator: 'items separator: default is coma',
			array_type: 'type of array items',
			format: 'date/time format',
			is_required: true,
			childs: {} // child options if it is an object
		};
	
	
	
	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_option(arg_class_proto, arg_option_obj)
	 * @desc				Register a class option
	 * @param {object}		arg_class_proto			class
	 * @param {object}		arg_option_obj			option object
	 * @return {nothing}
	 */
	DevaptOptions.register_option = function(arg_class_proto, arg_option_obj)
	{
		var context = 'DevaptOptions.register_option(class,option object)';
		DevaptTraces.trace_enter(context, '', DevaptOptions.options_register_trace);
		
		
		DevaptTraces.trace_var(context, 'arg_option_obj', arg_option_obj, DevaptOptions.options_register_trace);
		
		// CHECK ARGS
		if ( DevaptTypes.is_null(arg_class_proto) || ! DevaptTypes.is_object(arg_option_obj) )
		{
			DevaptTraces.trace_leave(context, 'bad class or bad option object', DevaptOptions.options_register_trace);
			return;
		}
		
		// GET CLASS NAME
		var class_name = DevaptClasses.get_class_name(arg_class_proto);
		if ( DevaptTypes.is_null(class_name) )
		{
			DevaptTraces.trace_leave(context, 'bad class name', DevaptOptions.options_register_trace);
			return;
		}
		
		// GET CLASS OPTIONS ARRAY
		var class_options = DevaptOptions.options[class_name];
		if ( ! DevaptTypes.is_object(class_options) )
		{
			DevaptOptions.options[class_name] = {};
			class_options = DevaptOptions.options[class_name];
		}
		
		// REGISTER OPTION
		arg_option_obj['class_name'] = class_name;
		class_options[arg_option_obj.name] = arg_option_obj;
		var is_required_count = arg_option_obj['is_required'] ? 1 : 0;
		// console.warn(is_required_count, class_name + '.is_required_count');
		if ( ! DevaptOptions.options_required[class_name] )
		{
			DevaptOptions.options_required[class_name] = 0;
		}
		DevaptOptions.options_required[class_name] += is_required_count;
		
		
		DevaptTraces.trace_leave(context, 'success', DevaptOptions.options_register_trace);
	}
	
	
	return DevaptOptions;
});