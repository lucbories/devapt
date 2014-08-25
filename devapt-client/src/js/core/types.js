/**
 * @file        core/types.js
 * @desc        Devapt static common features: Devapt static types operations
 * @ingroup     DEVAPT_CORE
 * @date        2013-05-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types-to'], function(Devapt, DevaptTraces, DevaptTypes)
{
	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.in_array(arg_array, arg_needle, arg_strict)
	 * @desc				Test a value is contained in an array
	 *
	 * Examples :
	 *	var myArray = new Array('test1', 'test3', 4);
	 *	in_array(myArray, '4'); // true
	 *	in_array(myArray, '4', true); // false
	 *	in_array(myArray, 4, true); // true
	 * 
	 * @param {array}		arg_array	array of values
	 * @param {string}		arg_needle	value to search in the array
	 * @param {boolean}		arg_strict	strict equality (===) if true, else simple equality (==)
	 * @return {boolean}
	 */
	DevaptTypes.in_array = function(arg_array, arg_needle, arg_strict)
	{
		arg_strict = !!arg_strict || false;

		for(var key in arg_array)
		{
			if (arg_strict)
			{
			
				if (arg_array[key] === arg_needle)
				{
				
					return true;
				}
			}
			else if (arg_array[key] == arg_needle)
			{
			
				return true;
			}
		}
		return false;
	}

	// BUG ???
	// Array.prototype.contains = function(thDevaptTypes.is_array, value)
	// {
		// return in_array(thDevaptTypes.is_array, value);
	// }
	
	
	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.lpad(arg_padding_str, arg_padding_length)
	 * @desc				Append padding string at the left of the self string if needed
	 * @param {string}		arg_padding_str			padding string
	 * @param {integer}		arg_padding_length		padding length
	 * @return {string}
	 */
	String.prototype.lpad = function(arg_padding_str, arg_padding_length)
	{
		var str = this;
		while (str.length < arg_padding_length)
		{
			str = arg_padding_str + str;
		}
		return str;
	}


	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.rpad(arg_padding_str, arg_padding_length)
	 * @desc				Append padding string at the right of the self string if needed
	 * @param {string}		arg_padding_str			padding string
	 * @param {integer}		arg_padding_length		padding length
	 * @return {string}
	 */
	String.prototype.rpad = function(arg_padding_str, arg_padding_length)
	{
		var str = this;
		while (str.length < arg_padding_length)
		{
			str += arg_padding_str;
		}
		return str;
	}
	

	/**
	 * @memberof			DevaptTypes
	 * @public
	 * @static
	 * @method				DevaptTypes.get_value(arg_value, arg_default_value)
	 * @desc				Get a value or default value if null or undefined
	 * @param {anything}	arg_value			value to convert
	 * @param {anything}	arg_default_value	default value
	 * @return {anything}
	 */
	DevaptTypes.get_value = function(arg_value, arg_default_value)
	{
		return ( DevaptTypes.is_undefined(arg_value) || DevaptTypes.is_null(arg_value) ) ? arg_default_value : arg_value;
	}
	
	
	return DevaptTypes;
} );