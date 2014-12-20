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
	
	
	/**
	 * @memberof				DevaptTypes
	 * @public
	 * @method					clone_object(arg_object_to_clone)
	 * @desc					Duplicate an existing object
	 * @param {object}			arg_object_to_clone		Object to clone
	 * @return {object}			Clone
	 */
	DevaptTypes.clone_object = function(arg_object_to_clone)
	{
		// console.log(arg_object_to_clone, 'DevaptTypes.arg_object_to_clone');
		
		// NULL OR SIMPLE TYPE (NOT OBJECT)
		if (arg_object_to_clone === null || arg_object_to_clone === true || arg_object_to_clone === false)
		{
			// console.log(arg_object_to_clone, 'clone null or boolean');
			return arg_object_to_clone;
		}
		
		// EMPTY ARRAY
		if ( DevaptTypes.is_empty_array(arg_object_to_clone) )
		{
			// console.log(arg_object_to_clone, 'clone empty array');
			return new Array();
		}
		
		// EMPTY OBJECT
		if ( DevaptTypes.is_empty_object(arg_object_to_clone)  )
		{
			// console.log(arg_object_to_clone, 'clone empty object');
			return new Object();
		}
		
		// STRING
		if ( DevaptTypes.is_string(arg_object_to_clone) )
		{
			// console.log(arg_object_to_clone, 'clone string');
			return arg_object_to_clone;
		}
		
		// DATE
		if ( DevaptTypes.is_date(arg_object_to_clone) )
		{
			// console.log(arg_object_to_clone, 'clone date');
			return new Date(arg_object_to_clone.getTime());
		}
		
		// NOT EMPTY ARRAY
		if ( DevaptTypes.is_array(arg_object_to_clone) )
		{
			// console.log(arg_object_to_clone, 'clone array');
			var tmp = new Array();
			for(key in arg_object_to_clone)
			{
				// console.log(arg_object_to_clone[key], 'clone array item [' + key + ']');
				var cloned_object = DevaptTypes.clone_object(arg_object_to_clone[key]);
				tmp.push(cloned_object);
			}
			return tmp;
		}
		
		// NOT EMPTY OBJECT
		if ( DevaptTypes.is_object(arg_object_to_clone) )
		{
			if (arg_object_to_clone.selector || (arg_object_to_clone.length > 0 && arg_object_to_clone.tagName) )
			{
				// console.log(arg_object_to_clone, 'clone jQuery object');
				return arg_object_to_clone;
			}
			
			// console.log(arg_object_to_clone, 'clone object');
			var cloned_object = jQuery.extend(true, new Object(), arg_object_to_clone);
			return cloned_object;
		}
		
		// console.log(arg_object_to_clone, 'not cloned object');
		return arg_object_to_clone;
	}
	
	return DevaptTypes;
} );