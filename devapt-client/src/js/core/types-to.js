/**
 * @file        core/types-to.js
 * @desc        Devapt static common features: Devapt static types operations
 * @ingroup     DEVAPT_CORE
 * @date        2013-05-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types-is'], function(Devapt, DevaptTraces, DevaptTypes)
{
	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.get_value_str(arg_value)
	 * @desc				Dump a value into a string
	 * @param {anything}	arg_value			value to dump
	 * @param {anything}	arg_stack_count		stack calls count
	 * @return {string}
	 */
	DevaptTypes.get_value_str = function(arg_value, arg_stack_count)
	{
		var max_calls = 10;
		
		// INIT STACK COUNTER
		if (arg_stack_count === undefined)
		{
			arg_stack_count = 0;
		}
		
		// CHECK STACK MAX CALLS
		if (arg_stack_count > max_calls)
		{
			return 'more than ' + max_calls + ' calls stack';
		}
		
		// NULL VALUE
		if ( DevaptTypes.is_null(arg_value) )
		{
			return 'null';
		}
		
		// FUNCTIONS
		if ( DevaptTypes.is_function(arg_value) )
		{
			return 'function:' + arg_value.name;
		}
		
		// ARRAYS
		if ( DevaptTypes.is_array(arg_value) )
		{
			var str = '[';
			for(key in arg_value)
			{
				str += (str === '[' ? '' : ',') + key + '=' + DevaptTypes.get_value_str( arg_value[key], arg_stack_count + 1);
			}
			return str + ']';
		}
		
		// OBJECTS
		if ( DevaptTypes.is_object(arg_value) )
		{
			var str = '{';
			
			if ( DevaptTypes.is_not_empty_str(arg_value['jquery']) )
			{
				str += 'a jqo object}';
				return str;
			}
			
			for(key in arg_value)
			{
				var right_4 = key.substring(key.length - 4, key.length);
				if ( right_4 === '_jqo' )
				{
					str += '\n  ' + key + '= a jqo object';
					continue;
				}
				var member = arg_value[key];
				if ( ! DevaptTypes.is_function(member) )
				{
					str += '\n  ' + key + '=' + DevaptTypes.get_value_str(member, arg_stack_count + 1);
				}
			}
			return str + (str === '{' ? '' : '\n') + '}';
		}
		
		// BOOLEAN
		if ( DevaptTypes.is_boolean(arg_value) )
		{
			return arg_value;
		}
		
		// NUMBER
		if ( DevaptTypes.is_number(arg_value) )
		{
			return arg_value;
		}
		
		// STRINGS
		if ( DevaptTypes.is_not_empty_str(arg_value) )
		{
			return arg_value;
		}
		
		return arg_value;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_string(arg_value, arg_default_value)
	 * @desc				Convert the value to a string
	 * @param {anything}	arg_value			value to convert
	 * @param {string}		arg_default_value	default value
	 * @return {string}
	 */
	DevaptTypes.to_string = function(arg_value, arg_default_value)
	{
		return ( DevaptTypes.is_string(arg_value) && arg_value !== '' ) ? arg_value : arg_default_value;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_list_item(arg_value, arg_list_items, arg_default_value)
	 * @desc				Test if the given value is part of the values list and return it or default value
	 * @param {anything}	arg_value			value to convert
	 * @param {anything}	arg_list_items		all items values
	 * @param {anything}	arg_default_value	default value
	 * @return {anything}
	 */
	DevaptTypes.to_list_item = function(arg_value, arg_list_items, arg_default_value)
	{
		if (! arg_value)
		{
			return arg_default_value;
		}
		if ( DevaptTypes.is_array(arg_list_items) )
		{
			return arg_value.lastIndexOf(arg_value) >= 0 ? arg_value : arg_default_value;
		}
		
		if ( DevaptTypes.is_object(arg_list_items) )
		{
			return arg_value in arg_list_items ? arg_value : arg_default_value;
		}
		
		return arg_value === arg_list_items ? arg_value : arg_default_value;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_boolean(arg_value, arg_default_value)
	 * @desc				Convert the value to a boolean
	 * @param {anything}	arg_value			value to convert
	 * @param {boolean}		arg_default_value	default value
	 * @return {boolean}
	 */
	DevaptTypes.to_boolean = function(arg_value, arg_default_value)
	{
		var default_value = DevaptTypes.is_undefined(arg_default_value) ? false : arg_default_value;
		
		if ( DevaptTypes.is_boolean(arg_value) )
		{
			return arg_value;
		}
		if ( DevaptTypes.is_number(arg_value) )
		{
			return arg_value > 0;
		}
		if ( DevaptTypes.is_string(arg_value) )
		{
			var str_value = arg_value.toLowerCase();
			if (str_value === 'true' || str_value === 'on' || str_value === '1' || str_value === 'y' || str_value === 'yes')
			{
				return new Boolean(true).valueOf();
			}
			return new Boolean(false).valueOf();
		}
		
		return new Boolean(default_value).valueOf();
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_number(arg_value, arg_default_value)
	 * @desc				Convert the value to a number
	 * @param {anything}	arg_value			value to convert
	 * @param {number}		arg_default_value	default value
	 * @return {number}
	 */
	DevaptTypes.to_number = function(arg_value, arg_default_value)
	{
		var default_value = DevaptTypes.is_undefined(arg_default_value) ? 0 : arg_default_value;
		
		if ( DevaptTypes.is_number(arg_value) )
		{
			return arg_value;
		}
		if ( DevaptTypes.is_boolean(arg_value) )
		{
			return arg_value ? 1 : 0;
		}
		if ( DevaptTypes.is_string(arg_value) )
		{
			try
			{
				var str_value = arg_value.toLowerCase();
				var value = eval(str_value);
				if ( DevaptTypes.is_number(value) )
				{
					return value;
				}
			} catch(e)
			{
				return default_value;
			}
		}
		
		return default_value;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_integer(arg_value, arg_default_value)
	 * @desc				Convert the value to a integer
	 * @param {anything}	arg_value			value to convert
	 * @param {integer}		arg_default_value	default value
	 * @return {integer}
	 */
	DevaptTypes.to_integer = function(arg_value, arg_default_value)
	{
		var default_value = DevaptTypes.is_undefined(arg_default_value) ? 0 : arg_default_value;
		
		if ( DevaptTypes.is_boolean(arg_value) )
		{
			return arg_value ? 1 : 0;
		}
		
		if ( DevaptTypes.is_number(arg_value) )
		{
			try
			{
				var value = parseInt(arg_value);
				return isNaN(value) ? default_value : value;
			} catch(e)
			{
				return default_value;
			}
		}
		
		if ( DevaptTypes.is_string(arg_value) )
		{
			try
			{
				var value = parseInt(arg_value);
				return isNaN(value) ? default_value : value;
			} catch(e)
			{
				return default_value;
			}
			return value;
		}
		
		return default_value;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_float(arg_value, arg_default_value)
	 * @desc				Convert the value to a float
	 * @param {anything}	arg_value			value to convert
	 * @param {float}		arg_default_value	default value
	 * @return {float}
	 */
	DevaptTypes.to_float = function(arg_value, arg_default_value)
	{
		var default_value = DevaptTypes.is_undefined(arg_default_value) ? 0.0 : arg_default_value;
		
		var value = default_value;
		if ( DevaptTypes.is_string(arg_value) || DevaptTypes.is_number(arg_value) )
		{
			try
			{
				value = parseFloat(arg_value);
				return isNaN(value) ? default_value : value;
			} catch(e)
			{
				return default_value;
			}
		}
		
		return value;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_date(arg_value, arg_default_value)
	 * @desc				Convert the value to a date
	 * @param {anything}	arg_value			value to convert
	 * @param {date}		arg_default_value	default value
	 * @return {date}
	 */
	DevaptTypes.to_date = function(arg_value, arg_default_value)
	{
		// INIT DEFAULT VALUE
		var default_value = DevaptTypes.is_null(arg_default_value) ? new Date().toLocaleDateString() : arg_default_value;
		
		// ARG VALUE IS A STRING
		if ( DevaptTypes.is_string(arg_value) )
		{
			if (arg_value === '')
			{
				return default_value;
			}
			
			try
			{
				value_int = Date.parse(arg_value);
				if ( isNaN(value_int) )
				{
					return default_value;
				}
				
				value = new Date(value);
				return DevaptTypes.is_date(value) ? value.toLocaleDateString() : default_value;
			}
			catch(e)
			{
				return default_value;
			}
		}
		
		// ARG VALUE IS A NUMBER
		if ( DevaptTypes.is_number(arg_value) )
		{
			value = new Date(arg_value);
			return value ? value.toLocaleDateString() : default_value;
		}
		
		// ARG VALUE IS NULL OR UNDEFINED OR OTHER CASES
		return default_value;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_time(arg_value, arg_default_value)
	 * @desc				Convert the value to a time
	 * @param {anything}	arg_value			value to convert
	 * @param {time}		arg_default_value	default value
	 * @return {time}
	 */
	DevaptTypes.to_time = function(arg_value, arg_default_value)
	{
		var default_value = DevaptTypes.is_undefined(arg_default_value) ? new Date() : arg_default_value;
		
		var value = default_value;
		if ( DevaptTypes.is_string(arg_value) )
		{
			value = new Date( Date.parse(arg_value) );
			
		}
		else if ( DevaptTypes.is_number(arg_value) )
		{
			value = new Date(arg_value);
		}
		if ( DevaptTypes.is_null(value) )
		{
			value = default_value;
		}
		else
		{
			value = value.toLocaleTimeString();
		}
		
		return value;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_datetime(arg_value, arg_default_value)
	 * @desc				Convert the value to a datetime
	 * @param {anything}	arg_value			value to convert
	 * @param {datetime}	arg_default_value	default value
	 * @return {datetime}
	 */
	DevaptTypes.to_datetime = function(arg_value, arg_default_value)
	{
		var default_value = DevaptTypes.is_undefined(arg_default_value) ? new Date() : arg_default_value;
		
		var value = default_value;
		if ( DevaptTypes.is_string(arg_value) )
		{
			value = new Date( Date.parse(arg_value) );
			
		}
		else if ( DevaptTypes.is_number(arg_value) )
		{
			value = new Date(arg_value);
		}
		
		if ( DevaptTypes.is_null(value) )
		{
			value = default_value;
		}
		else
		{
			value = value.toLocaleString();
		}
		
		return value;
	}


	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_string(arg_value, arg_default_value)
	 * @desc				Convert the value to a string
	 * @param {anything}	arg_value			value to convert
	 * @param {string}		arg_default_value	default value
	 * @return {string}
	 */
	DevaptTypes.to_string = function(arg_value, arg_default_value)
	{
		var default_value = DevaptTypes.is_undefined(arg_default_value) ? '' : arg_default_value;
		
		if ( DevaptTypes.is_string(arg_value) )
		{
			return arg_value;
		}
		
		return default_value;
	}


	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_array(arg_value, arg_default_value)
	 * @desc				Convert the value to an array
	 * @param {anything}	arg_value				value to convert
	 * @param {array}		arg_default_value		default value
	 * @param {string}		arg_items_separator		items separator of array string (default=',')
	 * @todo check array items types if a valid type is given
	 * @return {array}
	 */
	DevaptTypes.to_array = function(arg_value, arg_default_value, arg_items_separator)
	{
		var default_value = DevaptTypes.is_array(arg_default_value) ? arg_default_value : [];
		
		var value = null;
		
		if ( DevaptTypes.is_array(arg_value) )
		{
			value = arg_value;
		}
		else if ( DevaptTypes.is_string(arg_value) )
		{
			arg_items_separator	= DevaptTypes.is_not_empty_str(arg_items_separator) ? arg_items_separator : ',';
			
			value = arg_value.split(arg_items_separator);
		}
		else if ( DevaptTypes.is_object(arg_value) )
		{
			value = Object.values(arg_value);
		}
		
		if ( ! DevaptTypes.is_array(value) )
		{
			value = default_value;
		}
		
		return value;
	}


	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_object(arg_value, arg_default_value)
	 * @desc				Convert the value to an object
	 * @param {anything}	arg_value					value to convert
	 * @param {array}		arg_default_value			object template and default value
	 * @param {string}		arg_attributes_separator	attributes separator of object string (default=',')
	 * @param {string}		arg_name_value_separator	attributes name/value separator of object string (default='=')
	 * @return {array}
	 */
	DevaptTypes.to_object = function(arg_value, arg_default_value, arg_attributes_separator, arg_name_value_separator)
	{
		var default_value = DevaptTypes.is_object(arg_default_value) ? arg_default_value : {};
		
		var value = default_value;
		
		if ( DevaptTypes.is_object(arg_value) )
		{
			value = arg_value;
		}
		else if ( DevaptTypes.is_string(arg_value) )
		{
			arg_attributes_separator	= DevaptTypes.is_not_empty_str(arg_attributes_separator) ? arg_attributes_separator : ',';
			arg_name_value_separator	= DevaptTypes.is_not_empty_str(arg_name_value_separator) ? arg_name_value_separator : '=';
			
			var attributes = arg_value.split(arg_attributes_separator);
			if ( DevaptTypes.is_array(attributes) )
			{
				value = {};
				for(var attr_index = 0 ; attr_index < attributes.length ; attr_index++)
				{
					var attribute = attributes[attr_index].split(arg_name_value_separator);
					if ( DevaptTypes.is_array(attribute) && attribute.length == 2 )
					{
						var attr_key	= attribute[0];
						var attr_value	= attribute[1];
						value[attr_key]	= attr_value;
					}
				}
			}
		}
		
		// CHECK VALUE
		if ( ! DevaptTypes.is_object(value) )
		{
			value = default_value;
		}
		
		// APPEND MISSING ATTRIBUTES
		if ( DevaptTypes.is_object(value) && DevaptTypes.is_object(default_value) && value !== default_value )
		{
			for(loop_key in default_value)
			{
				var loop_default_value = default_value[loop_key];
				var loop_value = value[loop_key];
				if ( DevaptTypes.is_null(loop_value) )
				{
					value[loop_key] = loop_default_value;
				}
			}
		}
		
		return value;
	}


	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.to_callback(arg_value, arg_default_value)
	 * @desc				Convert the value to a callback
	 * @param {anything}		arg_value			value to convert
	 * @param {function|array}	arg_default_value	default value
	 * @return {function|array}
	 */
	DevaptTypes.to_callback = function(arg_value, arg_default_value)
	{
		var default_value = DevaptTypes.is_undefined(arg_default_value) ? null : arg_default_value;
		
		// CALLBACK IS A FUNCTION
		if ( DevaptTypes.is_function(arg_value) )
		{
			return arg_value;
		}
		
		// CALLBACK IS A METHOD CALL
		if ( DevaptTypes.is_array(arg_value) && arg_value.length >= 2 && DevaptTypes.is_object(arg_value[0]) && DevaptTypes.is_function(arg_value[1]) )
		{
			return arg_value;
		}
		
		// CALLBACK IS A FUNCTION CONTENT
		if ( DevaptTypes.is_string(arg_value) )
		{
			var cb = function()
				{
					eval(arg_value);
				};
			return cb;
		}
		
		return default_value;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.convert_value(arg_value, arg_default_value, arg_target_type)
	 * @desc				Convert a value to the given type if needed and returns default value if null or undefined
	 * @param {anything}	arg_value			value to convert
	 * @param {anything}	arg_default_value	default value
	 * @param {anything}	arg_target_type		target value type
	 * @param {anything}	arg_items_sep		items separator string (optional, ',' as default)
	 * @param {anything}	arg_field_def		field definition string (optional, '=' as default)
	 * @return {anything}
	 */
	DevaptTypes.convert_value = function(arg_value, arg_default_value, arg_target_type, arg_items_sep, arg_field_def)
	{
		var target_type = arg_target_type.toLocaleLowerCase();
		var target_value = arg_default_value;
		
		switch(target_type)
		{
			case 'boolean':		return DevaptTypes.to_boolean(arg_value, arg_default_value);
			case 'integer':		return DevaptTypes.to_integer(arg_value, arg_default_value);
			case 'float':		return DevaptTypes.to_float(arg_value, arg_default_value);
			case 'date':		return DevaptTypes.to_date(arg_value, arg_default_value);
			case 'time':		return DevaptTypes.to_time(arg_value, arg_default_value);
			case 'datetime':	return DevaptTypes.to_datetime(arg_value, arg_default_value);
			case 'callback':	return DevaptTypes.to_callback(arg_value, arg_default_value);
			case 'string':		return DevaptTypes.to_string(arg_value, arg_default_value);
			case 'function':	return DevaptTypes.to_string(arg_value, arg_default_value);
			case 'object':		return DevaptTypes.to_object(arg_value, arg_default_value, (arg_items_sep ? arg_items_sep : ','), (arg_field_def ? arg_field_def : '=') );
			case 'array':		return DevaptTypes.to_array(arg_value, arg_default_value, (arg_items_sep ? arg_items_sep : ',') );
		}
		
		return target_value;
	}
	
	
	return DevaptTypes;
} );