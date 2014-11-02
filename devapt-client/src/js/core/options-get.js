/**
 * @file        core/options-get.js
 * @desc        Devapt static object options features (get methods)
 * @ingroup     DEVAPT_CORE
 * @date        2014-08-14
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/classes', 'core/options-base'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses, DevaptOptions)
{
	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.has_option(arg_class_obj, arg_option_name)
	 * @desc				Test a class option
	 * @param {object}		arg_class_obj			class
	 * @param {object}		arg_option_name			option name
	 * @return {boolean}
	 */
	DevaptOptions.has_option = function(arg_class_obj, arg_option_name)
	{
		var context = 'DevaptOptions.has_option(class,option name)';
		DevaptTraces.trace_enter(context, '', DevaptOptions.options_get_trace);
		
		DevaptTraces.trace_var(context, 'arg_option_name', arg_option_name, DevaptOptions.options_get_trace);
		
		// CHECK ARGS
		if ( ! DevaptTypes.is_object(arg_class_obj) || ! DevaptTypes.is_string(arg_option_name) )
		{
			DevaptTraces.trace_leave(context, 'bad class or bad option name', DevaptOptions.options_get_trace);
			return false;
		}
		
		// GET CLASS NAME
		var class_name = DevaptClasses.get_class_name(arg_class_obj);
		if ( DevaptTypes.is_null(class_name) )
		{
			DevaptTraces.trace_leave(context, 'bad class name', DevaptOptions.options_get_trace);
			return false;
		}
		
		// CHECK CLASS OPTIONS
		var class_options = DevaptOptions.options[class_name];
		if ( ! DevaptTypes.is_object(class_options) )
		{
			DevaptTraces.trace_leave(context, 'bad class options', DevaptOptions.options_get_trace);
			return false;
		}
		
		// CHECK OPTION
		if ( ! DevaptTypes.is_object( class_options[arg_option_name] ) )
		{
			DevaptTraces.trace_leave(context, 'not found', DevaptOptions.options_get_trace);
			return false;
		}
		
		DevaptTraces.trace_leave(context, 'found', DevaptOptions.options_get_trace);
		return true;
	}



	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				Devapt.get_option(arg_class_obj, arg_option_name)
	 * @desc				Get an option
	 * @param {object}		arg_class_obj			class instance
	 * @param {object}		arg_option_name			option name
	 * @param {boolean}		arg_is_inherited		should search option in inheritance tree
	 * @param {array}		arg_class_names_stack	inheritance tree position
	 * @return {object}
	 */
	DevaptOptions.get_option = function(arg_class_obj, arg_option_name, arg_is_inherited, arg_class_names_stack)
	{
		var context = 'DevaptOptions.get_option(obj,option,inherited,class stack)';
		DevaptTraces.trace_enter(context, '', DevaptOptions.options_get_trace);
		
		
		DevaptTraces.trace_var(context, 'arg_class_names_stack', arg_class_names_stack ? arg_class_names_stack : 'empty', DevaptOptions.options_get_trace);
		
		// CHECK ARGS
		if ( ! (DevaptTypes.is_object(arg_class_obj) || DevaptTypes.is_string(arg_class_obj)) || ! DevaptTypes.is_string(arg_option_name) )
		{
			DevaptTraces.trace_leave(context, 'bad class instance', DevaptOptions.options_get_trace);
			return null;
		}
		
		// GET CLASS NAME
		var class_name = DevaptClasses.get_class_name(arg_class_obj);
		DevaptTraces.trace_var(context, 'class_name', class_name, DevaptOptions.options_get_trace);
		if ( DevaptTypes.is_null(class_name) )
		{
			DevaptTraces.trace_leave(context, 'bad class name', DevaptOptions.options_get_trace);
			return null;
		}
		
		// CHECK CLASS OPTIONS
		var class_options = DevaptOptions.options[class_name];
		// console.log(class_options, 'get_option class_options');
		if ( DevaptTypes.is_object(class_options) )
		{
			DevaptTraces.trace_step(context, 'class options are found', DevaptOptions.options_get_trace);
			
			// GET OPTION
			var option_obj = class_options[arg_option_name];
			if ( ! DevaptTypes.is_null(option_obj) )
			{
				DevaptTraces.trace_leave(context, 'found', DevaptOptions.options_get_trace);
				return option_obj;
			}
			// console.log(class_options, 'get_option class_options');
			
			// SEARCH OPTION NAME IN OPTIONS ALIAS
			for(option_key in class_options)
			{
				option_obj = class_options[option_key];
				if ( DevaptTypes.is_array(option_obj.aliases) && option_obj.aliases.indexOf(arg_option_name) >= 0 )
				{
					DevaptTraces.trace_leave(context, 'found with alias', DevaptOptions.options_get_trace);
					return option_obj;
				}
			}
		}
		
		// SEARCH OPTION NAME IN INHERITED CLASSES
		if (arg_is_inherited)
		{
			DevaptTraces.trace_step(context, 'search option name in inherited classes', DevaptOptions.options_get_trace);
			
			var inherited_classes = DevaptInheritance.get_inherited_classes(arg_class_obj);
			if ( DevaptTypes.is_null(arg_class_names_stack) )
			{
				arg_class_names_stack = [];
			}
			for(class_index in inherited_classes)
			{
				class_name = inherited_classes[class_index];
				DevaptTraces.trace_step(context, 'search in inherited class:[' + class_name + ']', DevaptOptions.options_get_trace);
				if (arg_class_names_stack.indexOf(class_name) < 0)
				{
					arg_class_names_stack.push(class_name);
					option_obj = DevaptOptions.get_option(class_name, arg_option_name, arg_is_inherited, arg_class_names_stack);
					if ( ! DevaptTypes.is_null(option_obj) )
					{
						DevaptTraces.trace_leave(context, 'found with inheritance', DevaptOptions.options_get_trace);
						return option_obj;
					}
				}
			}
		}
		
		// ALWAYS TRACE THIS PROBLEM
		// class_name = DevaptClasses.get_class_name(arg_class_obj);
		// DevaptTraces.trace_separator(true);
		// DevaptTraces.trace_step(context, '!!! option [' + arg_option_name + '] not found for [' + class_name + ']', DevaptOptions.options_get_trace);
		// DevaptTraces.trace_var(context, 'arg_class_obj', arg_class_obj, DevaptOptions.options_get_trace);
		DevaptTraces.trace_var(context, 'class_name', class_name, DevaptOptions.options_get_trace);
		DevaptTraces.trace_var(context, 'arg_option_name', arg_option_name, DevaptOptions.options_get_trace);
		// DevaptTraces.trace_separator(true);
		
		
		DevaptTraces.trace_leave(context, 'not found', DevaptOptions.options_get_trace);
		return null;
	}



	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.get_option_value(arg_class_proto, arg_option_name)
	 * @desc				Get an object option value
	 * @param {object}		arg_class_instance		class instance
	 * @param {string}		arg_option_name			option object
	 * @param {boolean}		arg_is_inherited		should search option in inheritance tree
	 * @return {anything}	Object value or option default value
	 */
	DevaptOptions.get_option_value = function(arg_class_instance, arg_option_name, arg_is_inherited)
	{
		var context = 'DevaptOptions.get_option_value(obj,option name)';
		DevaptTraces.trace_enter(context, '', DevaptOptions.options_get_trace);
		
		// CHECK ARGS
		if ( ! DevaptTypes.is_object(arg_class_instance) )
		{
			// console.log(arg_class_instance)
			DevaptTraces.trace_leave(context, 'class instance is not an object', DevaptOptions.options_get_trace);
			return null;
		}
		if ( ! DevaptTypes.is_string(arg_option_name) )
		{
			// console.log(arg_option_name);
			DevaptTraces.trace_leave(context, 'bad option name', DevaptOptions.options_get_trace);
			return null;
		}
		
		// GET OPTION
		var option = DevaptOptions.get_option(arg_class_instance, arg_option_name, arg_is_inherited, []);
		if ( ! DevaptTypes.is_object(option) )
		{
			DevaptTraces.trace_leave(context, 'bad option', DevaptOptions.options_get_trace);
			return null;
		}
		
		// GET OBJECT ATTRIBUTE
		var object_value = arg_class_instance[arg_option_name];
		if ( DevaptTypes.is_null(object_value) )
		{
			DevaptTraces.trace_leave(context, 'default option', DevaptOptions.options_get_trace);
			// console.info(option.default_value, 'get_option_value clone option default value');
			return DevaptOptions.clone_object(option.default_value);
		}
		
		DevaptTraces.trace_leave(context, 'found', DevaptOptions.options_get_trace);
		return object_value;
	}
	
	
	return DevaptOptions;
});