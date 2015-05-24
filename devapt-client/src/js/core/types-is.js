/**
 * @file        core/types-is.js
 * @desc        Devapt static common features: Devapt static types operations
 * 				API
 * 					...
 * 					is_not_empty_array_or_object(value): (boolean)
 * 					...
 * 					
 * @ingroup     DEVAPT_CORE
 * @date        2013-05-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define([/*'Devapt', */'core/traces'], function(/*Devapt, */DevaptTraces)
{
	/**
	 * @memberof	DevaptTypes
	 * @public
	 * @class
	 * @desc		Devapt types features container
	 */
	var DevaptTypes = function() {};
	
	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.type_of(arg_value)
	 * @desc				Get the type of a value
	 * @param {anything}	arg_value		value to get the type
	 * @return {string}		type name
	 */
	DevaptTypes.type_of = function(arg_value)
	{
		// THE VALUE IS NULL
		if (arg_value === null)
		{
			return 'null';
		}
		
		// THE VALUE HAS A SIMPLE TYPE
		var type = typeof(arg_value);
		if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean')
		{
			return type;
		}
		
		// THE VALUE IS A FUNCTION
		if (type === 'function') {
			return 'function';
		}
		
		// THE VALUE HAS AN STANDARD OBJECT
		var type_str = Object.prototype.toString.apply(arg_value);
		switch(type_str)
		{
			case '[object Array]':		return 'array';
			case '[object Date]':		return 'date';
			case '[object Boolean]':	return 'boolean';
			case '[object Number]':		return 'number';
			case '[object RegExp]':		return 'regexp';
		}
		
		// THE VALUE IS AN OTHER OBJECT
		if (type === 'object')
		{
			return 'object';
		}
		
		DevaptTraces.error( { source: 'DevaptTypes.type_of', text: 'unknow type of [' + arg_value + ']' } );
	}
	
	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_array(arg_value)
	 * @desc				Test if the value is an array
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_array = function(arg_value)
	{
		return Object.prototype.toString.apply(arg_value) === '[object Array]';
	}
	
	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_null(arg_value)
	 * @desc				Test if the value is an null or undefined
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_null = function(arg_value)
	{
		return arg_value == null || typeof arg_value === 'undefined';
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_null(arg_values)
	 * @desc				Test if an array of value are null or undefined
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_null = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) && arg_values.length > 0 )
		{
			return arg_values.every( DevaptTypes.is_null );
		}
		return DevaptTypes.is_null(arg_values);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_not_null(arg_value)
	 * @desc				Test if the value is a not null and not undefined
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_not_null = function(arg_value)
	{
		return ! DevaptTypes.is_null(arg_value);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_not_null(arg_values)
	 * @desc				Test if an array of value are not null and not undefined
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_not_null = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			return arg_values.length > 0 ? arg_values.every( DevaptTypes.is_not_null ) : false;
		}
		return DevaptTypes.is_not_null(arg_values);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @method				DevaptTypes.is_undefined(arg_value)
	 * @desc				Test if the value is undefined
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_undefined = function(arg_value)
	{
		return typeof arg_value === 'undefined';
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_object(arg_value)
	 * @desc				Test if the value is an object
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_object = function(arg_value)
	{
		return (! DevaptTypes.is_null(arg_value) ) && typeof arg_value === 'object';
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_empty_object(arg_value)
	 * @desc				Test if the value is an object without members
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_empty_object = function(arg_value)
	{
		return DevaptTypes.is_object(arg_value) && $.isEmptyObject(arg_value);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_not_empty_object(arg_value)
	 * @desc				Test if the value is a not empty object without members
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_not_empty_object = function(arg_value)
	{
		return DevaptTypes.is_object(arg_value) && ! $.isEmptyObject(arg_value);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_plain_object(arg_value)
	 * @desc				Test if the value is a plain object (created with {} or with new Object)
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_plain_object = function(arg_value)
	{
		return $.isPlainObject(arg_value);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_objectg(arg_values)
	 * @desc				Test if an array of value are object
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_object = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			return arg_values.length > 0 ? arg_values.every( DevaptTypes.is_object ) : false;
		}
		return DevaptTypes.is_object(arg_values);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_object_with(arg_value,arg_attributes_array)
	 * @desc				Test if the value is an object and has all given attributes names
	 * @param {object}		arg_value				value to test
	 * @param {array}		arg_attributes_array	array of attributes names
	 * @return {boolean}
	 */
	DevaptTypes.is_object_with = function(arg_value, arg_attributes_array)
	{
		var cb_has_attribute = function(attr_name) { return arg_value[attr_name] !== undefined; };
		return DevaptTypes.is_object(arg_value) && DevaptTypes.is_array(arg_attributes_array) && arg_attributes_array.every(cb_has_attribute);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_object_with(arg_values,arg_attributes_array)
	 * @desc				Test if an array of values are object and have all given attributes names
	 * @param {array}		arg_values			values to test
	 * @param {array}		arg_attributes_array	array of attributes names
	 * @return {boolean}
	 */
	DevaptTypes.are_object_with = function(arg_values, arg_attributes_array)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			var cb_is_object_with = function(obj)
				{
					var cb_has_attribute = function(attr_name) { return obj[attr_name] !== undefined; };
					return arg_attributes_array.every(cb_has_attribute);
				};
			return arg_values.length > 0 ? arg_values.every(cb_is_object_with) : false;
		}
		return DevaptTypes.is_object_with(arg_values);
	}
	
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_string(arg_value)
	 * @desc				Test if the value is a string
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_string = function(arg_value)
	{
		return typeof arg_value === 'string' || typeof arg_value === 'String';
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_string(arg_values)
	 * @desc				Test if an array of value are string
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_string = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			return arg_values.length > 0 ? arg_values.every( DevaptTypes.is_string ) : false;
		}
		return DevaptTypes.is_string(arg_values);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_boolean(arg_value)
	 * @desc				Test if the value is a boolean
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_boolean = function(arg_value)
	{
		return typeof arg_value == 'boolean' || typeof arg_value == 'Boolean';
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_boolean(arg_values)
	 * @desc				Test if an array of value are boolean
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_boolean = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			return arg_values.length > 0 ? arg_values.every( DevaptTypes.is_boolean ) : false;
		}
		return DevaptTypes.is_boolean(arg_values);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @method				DevaptTypes.is_numeric(arg_value)
	 * @desc				Test if the value is a number
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_numeric = function(arg_value)
	{
		return typeof arg_value == 'number' || typeof arg_value == 'Number';
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_number(arg_value)
	 * @desc				Test if the value is a number
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_number = function(arg_value)
	{
		return typeof arg_value === 'number' || typeof arg_value === 'Number';
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_number(arg_values)
	 * @desc				Test if an array of value are number
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_number = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			return arg_values.length > 0 ? arg_values.every( DevaptTypes.is_number ) : false;
		}
		return DevaptTypes.is_number(arg_values);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_integer(arg_value)
	 * @desc				Test if the value is a integer
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_integer = function(arg_value)
	{
		if ( DevaptTypes.is_number(arg_value) || DevaptTypes.is_string(arg_value) )
		{
			var value = parseInt(arg_value) ;
			return (! isNaN(value) && value  == arg_value) ? true : false;
		}
		return false;
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_integer(arg_values)
	 * @desc				Test if an array of value are integers
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_integer = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			return arg_values.length > 0 ? arg_values.every( DevaptTypes.is_integer ) : false;
		}
		return DevaptTypes.is_integer(arg_values);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_float(arg_value)
	 * @desc				Test if the value is a float
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_float = function(arg_value)
	{
		if ( DevaptTypes.is_number(arg_value) || DevaptTypes.is_string(arg_value) )
		{
			return ! isNaN( parseFloat(arg_value) );
		}
		return false;
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_float(arg_values)
	 * @desc				Test if an array of value are floats
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_float = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			return arg_values.length > 0 ? arg_values.every( DevaptTypes.is_float ) : false;
		}
		return DevaptTypes.is_float(arg_values);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @method				DevaptTypes.is_function(arg_value)
	 * @desc				Test if the value is a function
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_function = function(arg_value)
	{
		return typeof arg_value === 'function';
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.function(arg_values)
	 * @desc				Test if an array of value are function
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_function = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			return arg_values.length > 0 ? arg_values.every( DevaptTypes.is_function ) : false;
		}
		return DevaptTypes.is_function(arg_values);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_function(arg_value)
	 * @desc				Test if the value is a callback (a function or a object/function array.
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_callback = function(arg_value)
	{
		if ( Object.prototype.toString.apply(arg_value) === '[object Array]' )
		{
			if (arg_value.length < 2)
			{
				return false;
			}
			if ( ! DevaptTypes.is_object(arg_value[0]) && ! DevaptTypes.is_function(arg_value[0]) )
			{
				return false;
			}
			if ( ! DevaptTypes.is_function(arg_value[1]) )
			{
				return false;
			}
			return true;
		}
		return DevaptTypes.is_function(arg_value);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.DevaptTypes.is_empty_array_or_null(arg_value)
	 * @desc				Test if the value is an empty array
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_empty_array = function(arg_value)
	{
		return DevaptTypes.is_array(arg_value) && (arg_value.length === 0);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_empty_array_or_null(arg_value)
	 * @desc				Test if the value is an empty array or null or undefined
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_empty_array_or_null = function(arg_value)
	{
		return DevaptTypes.is_null(arg_value) || ( DevaptTypes.is_array(arg_value) && (arg_value.length === 0) );
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_not_empty_array(arg_value)
	 * @desc				Test if the value is a not empty array
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_not_empty_array = function(arg_value)
	{
		return DevaptTypes.is_array(arg_value) && (arg_value.length > 0);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_not_empty_array_or_object(arg_value)
	 * @desc				Test if the value is a not empty array
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_not_empty_array_or_object = function(arg_value)
	{
		return DevaptTypes.is_not_empty_array(arg_value)
			|| DevaptTypes.is_not_empty_object(arg_value);
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_empty_str_or_null(arg_value)
	 * @desc				Test if the value is an empty string
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_empty_str = function(arg_value)
	{
		return DevaptTypes.is_string(arg_value) && arg_value === '';
	}
	DevaptTypes.is_empty_string = DevaptTypes.is_empty_str;

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_empty_str_or_null(arg_value)
	 * @desc				Test if the value is an empty string or null or undefined
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_empty_str_or_null = function(arg_value)
	{
		return DevaptTypes.is_null(arg_value) || ( DevaptTypes.is_string(arg_value) && arg_value === '' );
	}
	DevaptTypes.is_empty_string_or_null = DevaptTypes.is_empty_str_or_null;
	
	/**
	 * @memberof		Devapt
	 * @public
	 * @static
	 * @method				DevaptTypes.is_not_empty_str(arg_value)
	 * @desc				Test if the value is a not empty string
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_not_empty_str = function(arg_value)
	{
		return DevaptTypes.is_string(arg_value) && arg_value !== '' && arg_value.length > 0;
	}
	DevaptTypes.is_not_empty_string = DevaptTypes.is_not_empty_str;

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_empty_int(arg_value)
	 * @desc				Test if the value is an empty integer
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_empty_int = function(arg_value)
	{
		return DevaptTypes.is_number(arg_value) && arg_value === 0;
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_empty_int(arg_value)
	 * @desc				Test if the value is an empty integer or null or undefined
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_empty_int_or_null = function(arg_value)
	{
		return DevaptTypes.is_null(arg_value) || ( DevaptTypes.is_number(arg_value) && arg_value === 0 );
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.is_date(arg_value)
	 * @desc				Test if the value is a float
	 * @param {anything}	arg_value			value to test
	 * @return {boolean}
	 */
	DevaptTypes.is_date = function(arg_value)
	{
		if ( DevaptTypes.is_object(arg_value) && arg_value instanceof Date )
		{
			return true;
		}
		return false;
	}

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.are_date(arg_values)
	 * @desc				Test if an array of value are dates
	 * @param {array}		arg_values			values to test
	 * @return {boolean}
	 */
	DevaptTypes.are_date = function(arg_values)
	{
		if ( DevaptTypes.is_array(arg_values) )
		{
			return arg_values.length > 0 ? arg_values.every( DevaptTypes.is_date ) : false;
		}
		return DevaptTypes.is_date(arg_values);
	}
	
	
	return DevaptTypes;
} );