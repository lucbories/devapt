/**
 * @file        core/classes.js
 * @desc        Devapt static classes features
 * 		API
 * 			STATIC PUBLIC ATTRIBUTES
 * 				DevaptClasses.classes_trace = true
 * 				DevaptClasses.introspect_classes_array = []
 * 				DevaptClasses.introspect_classes_by_name = {}
 * 				DevaptClasses.introspect_instances_array = []
 * 				DevaptClasses.introspect_instances_by_name = {}
 * 				
 * 			STATIC PUBLIC METHODS
 * 				DevaptClasses.get_classes_array():array
 * 				DevaptClasses.get_classes_map():object
 * 				DevaptClasses.get_instances_array():array
 * 				DevaptClasses.get_instances_map():object
 * 
 * 				DevaptClasses.add_class(arg_class_object):nothing
 * 				DevaptClasses.get_class(arg_class_name):object|null
 * 
 * 				DevaptClasses.add_instance(arg_instance_object):nothing
 * 				DevaptClasses.get_instance(arg_instance_name):object|null
 * 
 * 				DevaptClasses.new_class_uid():integer
 * 				DevaptClasses.new_instance_uid():integer
 * 			
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types'], function(Devapt, DevaptTraces, DevaptTypes)
{
	/**
	 * @memberof	DevaptClasses
	 * @public
	 * @class
	 * @desc		Devapt classes features container
	 */
	var DevaptClasses = {};
	
	
	/**
	 * @memberof	DevaptClasses
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptClasses.classes_trace = true;
	
	
	/**
	 * @memberof	DevaptClasses
	 * @public
	 * @static
	 * @desc		Array of class objects
	 */
	DevaptClasses.introspect_classes_array = [];



	/**
	 * @memberof	DevaptClasses
	 * @public
	 * @static
	 * @desc		Associative array of class instances objects
	 */
	DevaptClasses.introspect_classes_by_name = {};
	
	
	/**
	 * @memberof	DevaptClasses
	 * @public
	 * @static
	 * @desc		Array of class instances objects
	 */
	DevaptClasses.introspect_instances_array = [];



	/**
	 * @memberof	DevaptClasses
	 * @public
	 * @static
	 * @desc		Associative array of class objects
	 */
	DevaptClasses.introspect_instances_by_name = {};
	
	
	
	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.get_classes_array()
	 * @desc				Get the classes array
	 * @return {array}		Array of objects
	 */
	DevaptClasses.get_classes_array = function()
	{
		return DevaptClasses.introspect_classes_array;
	}
	
	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.get_classes_map()
	 * @desc				Get the classes map
	 * @return {object}		Associative array of objects
	 */
	DevaptClasses.get_classes_map = function()
	{
		return DevaptClasses.introspect_classes_by_name;
	}
	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.get_instances_array()
	 * @desc				Get the classes instances array
	 * @return {array}		Array of objects
	 */
	DevaptClasses.get_instances_array = function()
	{
		return DevaptClasses.introspect_instances_array;
	}
	
	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.get_instances_map()
	 * @desc				Get the classes instances map
	 * @return {object}		Associative array of objects
	 */
	DevaptClasses.get_instances_map = function()
	{
		return DevaptClasses.introspect_instances_by_name;
	}
	
	
	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.add_class(class)
	 * @desc				Add a class object
	 * @param {object}		arg_class_object		class object
	 * @return {nothing}
	 */
	DevaptClasses.add_class = function(arg_class_object)
	{
		DevaptClasses.introspect_classes_by_name[arg_class_object.infos.class_name] = arg_class_object;
		DevaptClasses.introspect_classes_array.push(arg_class_object);
	}
	
	
	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.get_class(class name)
	 * @desc				Get a class object
	 * @param {string}		arg_class_name		class name
	 * @return {object|null}	class object
	 */
	DevaptClasses.get_class = function(arg_class_name)
	{
		var obj = DevaptClasses.introspect_classes_by_name[arg_class_name];
		return obj ? obj : null;
	}
	
	
	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.add_instance(instance)
	 * @desc				Add a class instance object
	 * @param {object}		arg_instance_object		class instance object
	 * @return {nothing}
	 */
	DevaptClasses.add_instance = function(arg_instance_object)
	{
		DevaptClasses.introspect_instances_by_name[arg_instance_object.name] = arg_instance_object;
		DevaptClasses.introspect_instances_array.push(arg_instance_object);
	}
	
	
	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.get_instance(instance name)
	 * @desc				Get an instance object
	 * @param {string}		arg_instance_name		instance name
	 * @return {object|null}	instance object
	 */
	DevaptClasses.get_instance = function(arg_instance_name)
	{
		var obj = DevaptClasses.introspect_instances_by_name[arg_instance_name];
		return obj ? obj : null;
	}
	
	
	
	/**
	 * @memberof				DevaptClasses
	 * @public
	 * @static
	 * @method					DevaptClasses.new_class_uid()
	 * @desc					
	 * @return {integer}
	 */
	DevaptClasses.new_class_uid = function()
	{
		var context = 'DevaptClasses.new_class_uid()';
		DevaptTraces.trace_enter(context, '', DevaptClasses.classes_trace);
		
		DevaptTraces.trace_leave(context, '', DevaptClasses.classes_trace);
		return DevaptClasses.introspect_classes_array.length;
	}
	
	
	
	/**
	 * @memberof				DevaptClasses
	 * @public
	 * @static
	 * @method					DevaptClasses.new_instance_uid()
	 * @desc					
	 * @return {integer}
	 */
	DevaptClasses.new_instance_uid = function()
	{
		var context = 'DevaptClasses.new_instance_uid()';
		DevaptTraces.trace_enter(context, '', DevaptClasses.classes_trace);
		
		DevaptTraces.trace_leave(context, '', DevaptClasses.classes_trace);
		return DevaptClasses.introspect_instances_array.length;
	}
	
	
	
	
	

	/**
	 * @memberof				DevaptClasses
	 * @public
	 * @static
	 * @method					DevaptClasses.get_class_name(arg_class_proto)
	 * @desc					Get a class name from a class prototype, a class object, a class name
	 * @param {object|string}	arg_class_value			A class name, a class instance, a class prototype
	 * @return {string}
	 */
/*	DevaptClasses.get_class_name = function(arg_class_value)
	{
		var context = 'DevaptClasses.get_class_name(class value)';
		DevaptTraces.trace_enter(context, '', DevaptClasses.classes_trace);
		
		
		// CHECK ARGS
		if ( DevaptTypes.is_null(arg_class_value) )
		{
			DevaptTraces.trace_leave(context, 'class value is null', DevaptClasses.classes_trace);
			return null;
		}
		
		// GET CLASS NAME FROM A STRING
		if ( DevaptTypes.is_string(arg_class_value) )
		{
			// console.log('arg_class_value:' + arg_class_value);
			DevaptTraces.trace_leave(context, 'class value is a string', DevaptClasses.classes_trace);
			return arg_class_value;
		}
		
		// GET CLASS NAME FROM A FUNCTION
		if ( DevaptTypes.is_function(arg_class_value) )
		{
			DevaptTraces.trace_step(context, 'DevaptClasses.get_class_name : from a function', DevaptClasses.classes_trace);
			
			if ( DevaptTypes.is_string(arg_class_value.name) )
			{
				DevaptTraces.trace_leave(context, 'class value is a function and its name is a string', DevaptClasses.classes_trace);
				return arg_class_value.name;
			}
			else
			{
				DevaptTraces.trace_step(context, 'DevaptClasses.get_class_name : from a function : without .name', DevaptClasses.classes_trace);
				
				if (arg_class_value.prototype.name !== undefined)
				{
					DevaptTraces.trace_leave(context, 'class value is a function and its prototype name is defined', DevaptClasses.classes_trace);
					return arg_class_value.prototype.name;
				}
				else
				{
					var func_name_regex = /function\s+(.{1,})\s*\(/;
					var src_code = arg_class_value.toString();
					var results = func_name_regex.exec(src_code);
					var class_name = (results && results.length > 1) ? results[1] : "";
					
					DevaptTraces.trace_leave(context, 'class value is a function and its prototype name is undefined', DevaptClasses.classes_trace);
					return class_name;
				}
			}
		}
		
		// GET CLASS NAME FROM A DevaptObject OR PARENT CLASS INSTANCE
		if ( DevaptTypes.is_object(arg_class_value) )
		{
			if ( DevaptTypes.is_string(arg_class_value.class_name) )
			{
				DevaptTraces.trace_leave(context, 'class value is an object and class value object name is a string', DevaptClasses.classes_trace);
				return arg_class_value.class_name;
			}
		}
		
		
		DevaptTraces.trace_leave(context, 'bad class value', DevaptClasses.classes_trace);
		return null;
	}
*/




	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.register_class_record(arg_class_obj)
	 * @desc				Register a class record
	 * @param {object}		arg_classe_obj
	 * @return {nothing}
	 */
/*	DevaptClasses.register_class_record = function(arg_class_obj)
	{
		var context = 'DevaptClasses.register_class_record(class record)';
		DevaptTraces.trace_enter(context, '', DevaptClasses.classes_trace);
		DevaptTraces.trace_value(context, 'typeof class object', typeof arg_class_obj, DevaptClasses.classes_trace);
		DevaptTraces.trace_value(context, 'class object', arg_class_obj, DevaptClasses.classes_trace);
		// console.log(arg_class_obj, 'arg_class_obj');
		
		
		// CHECK CLASS RECORD
		if ( ! DevaptTypes.is_object(arg_class_obj) )
		{
			DevaptTraces.error(context + ': bad class record');
			DevaptTraces.trace_leave(context, 'bad class record', DevaptClasses.classes_trace);
			return;
		}
		
		// CHECK CLASS RECORD ATTRIBUTES
		if ( ! DevaptTypes.is_string(arg_class_obj.name) )
		{
			DevaptTraces.error(context + ': bad class record name');
			DevaptTraces.trace_leave(context, 'bad class record name', DevaptClasses.classes_trace);
			return;
		}
		if ( ! DevaptTypes.is_array(arg_class_obj.parents_array) )
		{
			DevaptTraces.error(context + ': bad class record parents');
			DevaptTraces.trace_leave(context, 'bad class record parents', DevaptClasses.classes_trace);
			return;
		}
		if ( ! DevaptTypes.is_object(arg_class_obj.parents_by_name) )
		{
			arg_class_obj.parents_by_name = {};
		}
		
		// REGISTER CLASS RECORD
		DevaptClasses.introspect_classes_array.push(arg_class_obj);
		DevaptClasses.introspect_classes_by_name[arg_class_obj.name] = arg_class_obj;
		DevaptTraces.trace_value(context, 'typeof arg_class_obj', typeof arg_class_obj, DevaptClasses.classes_trace);
		DevaptTraces.trace_value(context, 'arg_class_obj', arg_class_obj, DevaptClasses.classes_trace);
					
		// UPDATE INHERITANCES
		for(parent_index in arg_class_obj.parents_array)
		{
			var parent_value = arg_class_obj.parents_array[parent_index];
			// console.log(parent_value, 'parent_value');
			if ( DevaptTypes.is_string(parent_value) )
			{
				var class_record = DevaptClasses.introspect_classes_by_name[parent_value];
				if ( ! DevaptTypes.is_object(class_record) )
				{
					DevaptClasses.classes_trace = true;
					DevaptTraces.trace_value(context, 'typeof inherited class record', typeof class_record, DevaptClasses.classes_trace);
					DevaptTraces.trace_value(context, 'inherited class record', class_record, DevaptClasses.classes_trace);
					DevaptTraces.error(context + ': bad inherited class record [' + parent_value + ']');
					DevaptClasses.classes_trace = false;
					DevaptTraces.trace_leave(context, 'bad inherited class record', DevaptClasses.classes_trace);
					return;
				}
				
				arg_class_obj.parents_array[parent_index] = class_record;
				arg_class_obj.parents_by_name[class_record.name] = class_record;
				
				class_record.childs_array.push(arg_class_obj);
				class_record.childs_by_name[arg_class_obj.name] = arg_class_obj;
			}
		}
		
		
		DevaptTraces.trace_leave(context, 'success', DevaptClasses.classes_trace);
	}*/



	/**
	 * @memberof			DevaptClasses
	 * @public
	 * @static
	 * @method				DevaptClasses.register_class(arg_class_proto, arg_class_parents, arg_class_author, arg_class_updated, arg_class_desc)
	 * @desc				Register a class
	 * @param {object}		arg_class_proto
	 * @param {array}		arg_class_parents
	 * @param {string}		arg_class_author
	 * @param {string}		arg_class_updated
	 * @param {string}		arg_class_desc
	 * @return {nothing}
	 */
/*	DevaptClasses.register_class = function(arg_class_proto, arg_class_parents, arg_class_author, arg_class_updated, arg_class_desc)
	{
		var context = 'DevaptClasses.register_class(proto,parents,author,updated,descr)';
		DevaptTraces.trace_enter(context, '', DevaptClasses.classes_trace);
		DevaptTraces.trace_value(context, 'typeof arg_class_proto', typeof arg_class_proto, DevaptClasses.classes_trace);
		DevaptTraces.trace_value(context, 'arg_class_proto', arg_class_proto, DevaptClasses.classes_trace);
		// console.log(arg_class_proto, 'arg_class_proto');
		
		
		// CHECK CLASS NAME
		// if ( ! DevaptTypes.is_function(arg_class_proto) )
		// {
			// DevaptTraces.error(context + ': bad class prototype');
			// DevaptTraces.trace_leave(context, 'bad class prototype', DevaptClasses.classes_trace);
			// return;
		// }
		
		// CHECK CLASS PARENTS
		if ( ! DevaptTypes.is_array(arg_class_parents) )
		{
			arg_class_parents = [];
		}
		
		// CHECK CLASS AUTHOR
		if ( ! DevaptTypes.is_string(arg_class_author) || arg_class_author.length == 0 )
		{
			arg_class_author = 'Luc BORIES';
		}
		
		// CHECK CLASS UPDATE DATE
		if ( ! DevaptTypes.is_string(arg_class_updated) || arg_class_updated.length == 0 )
		{
			arg_class_updated = '2013-01-01';
		}
		
		// CHECK CLASS DESCRIPTION
		if ( ! DevaptTypes.is_string(arg_class_desc) )
		{
			arg_class_desc = '';
		}
		
		var class_record =
			{
				name: Devapt.get_prototype_name(arg_class_proto),
				proto: arg_class_proto,
				parents_array: arg_class_parents,
				parents_by_name: {},
				childs_array: [],
				childs_by_name: {},
				options_array: [],
				options_by_name: {},
				author: arg_class_author,
				updated: arg_class_updated,
				description: arg_class_desc
			};
		
		DevaptClasses.register_class_record(class_record);
		
		
		DevaptTraces.trace_leave(context, 'success', DevaptClasses.classes_trace);
	}*/
	
	
	return DevaptClasses;
} );