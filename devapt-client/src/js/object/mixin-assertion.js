/**
 * @file        object/mixin-assertion.js
 * @desc        Mixin of methods for assertion
 * @see			DevaptObject
 * @ingroup     DEVAPT_OBJECT
 * @date        2013-06-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define( ['core/types', 'core/inheritance', 'object/class'],
function(DevaptTypes, DevaptInheritance, DevaptClass)
{
	var DevaptMixinAssertion =
	{
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @desc				Enable or disable the assertions trace
		 */
		trace_assert: false,
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert(arg_context, arg_name, arg_value, arg_label)
		 * @desc				Assert that value is true (assert failed if value is false)
		 * @param {string}		arg_context			assertion context
		 * @param {boolean}		arg_test			assertion test
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_label			assertion label : kind of check
		 * @param {string}		arg_value			assertion value
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert: function(arg_context, arg_name, arg_test, arg_label, arg_value)
		{
			if ( ! arg_test )
			{
				var msg = this.class_name + ':' + (arg_label ? arg_label : 'Assert True') + ' failed for name=[' + arg_name + '] value=[' + arg_value + ']';
				this.error(arg_context, msg, this.trace_assert);
				throw(arg_context + ':' + msg);
			}
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_true(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is true
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_true: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, DevaptTypes.is_boolean(arg_value) && arg_value, 'Assert True', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_false(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is false
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_false: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, DevaptTypes.is_boolean(arg_value) && (! arg_value), 'Assert False', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_null(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is null
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_null: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, DevaptTypes.is_null(arg_value), 'Assert Null', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_not_null(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is not null
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_not_null: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, ! DevaptTypes.is_null(arg_value), 'Assert NotNull', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_inherit(arg_context, arg_name, arg_value, arg_class_obj)
		 * @desc				Assert that value inherits of a given class
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_inherit: function(arg_context, arg_name, arg_value, arg_class_obj)
		{
			var bool_result = arg_value instanceof arg_class_obj || DevaptInheritance.test_inheritance(arg_value, arg_class_obj);
			this.assert(arg_context, arg_name, bool_result, 'Assert Inherit', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_typeof(arg_context, arg_name, arg_value, arg_type_name)
		 * @desc				Assert that value is of a given type
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @param {string}		arg_type_name		type name
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_typeof: function(arg_context, arg_name, arg_value, arg_type_name)
		{
			this.assert(arg_context, arg_name, typeof arg_value == arg_type_name, 'Assert Typeof', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_function(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is a function
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_function: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, DevaptTypes.is_function(arg_value), 'Assert Function', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_callback(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is a callback
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_callback: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, DevaptTypes.is_callback(arg_value), 'Assert Callback', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_object(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is an object
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_object: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, DevaptTypes.is_object(arg_value), 'Assert Object', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_object_size(arg_context, arg_name, arg_value, arg_size_min, arg_size_max)
		 * @desc				Assert that value is an object and the attributes count is greater or equal to the given min size and lesser or equal to the given max size
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @param {integer}		arg_size_min		assertion array minimal size
		 * @param {integer}		arg_size_max		assertion array maximal size
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_object_size: function(arg_context, arg_name, arg_value, arg_size_min, arg_size_max)
		{
			var keys_count = DevaptTypes.is_object(arg_value) ? Object.keys(arg_value).length : -1;
			var min_is_valid = keys_count >= arg_size_min;
			var max_is_valid = DevaptTypes.is_null(arg_size_max) ? true : (keys_count <= arg_size_max);
			this.assert(arg_context, arg_name, DevaptTypes.is_object(arg_value) && min_is_valid && max_is_valid, 'Assert assert_object_size', 'length:' + arg_value.length + ' min:' + min_is_valid + ' max:' + max_is_valid);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_array(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is an array
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_array: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, DevaptTypes.is_array(arg_value), 'Assert Array', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_array_size(arg_context, arg_name, arg_value, arg_size_min, arg_size_max)
		 * @desc				Assert that value is an array and the array size is greater or equal to the given min size and lesser or equal to the given max size
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @param {integer}		arg_size_min		assertion array minimal size
		 * @param {integer}		arg_size_max		assertion array maximal size
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_array_size: function(arg_context, arg_name, arg_value, arg_size_min, arg_size_max)
		{
			this.assert(arg_context, arg_name, DevaptTypes.is_array(arg_value) && arg_value.length >= arg_size_min && (DevaptTypes.is_null(arg_size_max) ? true : (arg_value.length <= arg_size_max) ), 'Assert assert_array_size', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_not_empty_array(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is an array ans it is not empty
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_not_empty_array: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, DevaptTypes.is_array(arg_value) && arg_value.length > 0, 'Assert NotEmptyArray', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_not_empty_object_or_array(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is an array or an object and the array or object is not empty
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_not_empty_object_or_array: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, (DevaptTypes.is_array(arg_value) && arg_value.length > 0) || DevaptTypes.is_object(arg_value), 'Assert NotEmptyArrayOrObject', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_not_empty_string(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is a string and the string is not empty
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_not_empty_string: function(arg_context, arg_name, arg_value)
		{
			if ( ! DevaptTypes.is_not_empty_str(arg_value), 'Assert NotEmptyString', arg_value);
		},
		
		
		/**
		 * @memberof			DevaptMixinAssertion
		 * @public
		 * @method				assert_not_empty_value(arg_context, arg_name, arg_value)
		 * @desc				Assert that value is not null and the value is not an empty string
		 * @param {string}		arg_context			assertion context
		 * @param {string}		arg_name			assertion value name
		 * @param {string}		arg_value			assertion value to test
		 * @return {nothing}	(throw exception if assertion failed)
		 */
		assert_not_empty_value: function(arg_context, arg_name, arg_value)
		{
			this.assert(arg_context, arg_name, ! DevaptTypes.is_null(arg_value) && arg_value !== '' && arg_value !== {} && arg_value !== [], 'Assert NotEmptyValue', arg_value);
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-01',
			'updated':'2014-12-05',
			'description':'Mixin methods to assert values.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinAssertionClass
	 * @public
	 * @desc				Mixin of methods for values assertion
	 */
	var DevaptMixinAssertionClass = new DevaptClass('DevaptMixinAssertion', null, class_settings);
	
	DevaptMixinAssertionClass.add_public_method('assert', {}, DevaptMixinAssertion.assert);
	
	DevaptMixinAssertionClass.add_public_method('assert_true', {}, DevaptMixinAssertion.assert_true);
	DevaptMixinAssertionClass.add_public_method('assert_true', {}, DevaptMixinAssertion.assert_true);
	DevaptMixinAssertionClass.add_public_method('assert_false', {}, DevaptMixinAssertion.assert_false);
	DevaptMixinAssertionClass.add_public_method('assert_false', {}, DevaptMixinAssertion.assert_false);
	
	DevaptMixinAssertionClass.add_public_method('assert_null', {}, DevaptMixinAssertion.assert_null);
	DevaptMixinAssertionClass.add_public_method('assert_null', {}, DevaptMixinAssertion.assert_null);
	DevaptMixinAssertionClass.add_public_method('assert_not_null', {}, DevaptMixinAssertion.assert_not_null);
	DevaptMixinAssertionClass.add_public_method('assert_not_null', {}, DevaptMixinAssertion.assert_not_null);
	
	DevaptMixinAssertionClass.add_public_method('assert_inherit', {}, DevaptMixinAssertion.assert_inherit);
	DevaptMixinAssertionClass.add_public_method('assert_inherits', {}, DevaptMixinAssertion.assert_inherit);
	
	DevaptMixinAssertionClass.add_public_method('assert_typeof', {}, DevaptMixinAssertion.assert_typeof);
	DevaptMixinAssertionClass.add_public_method('assert_typeof', {}, DevaptMixinAssertion.assert_typeof);
	
	DevaptMixinAssertionClass.add_public_method('assert_function', {}, DevaptMixinAssertion.assert_function);
	DevaptMixinAssertionClass.add_public_method('assert_function', {}, DevaptMixinAssertion.assert_function);
	
	DevaptMixinAssertionClass.add_public_method('assert_object', {}, DevaptMixinAssertion.assert_object);
	DevaptMixinAssertionClass.add_public_method('assert_object', {}, DevaptMixinAssertion.assert_object);
	DevaptMixinAssertionClass.add_public_method('assert_object_size', {}, DevaptMixinAssertion.assert_object_size);
	DevaptMixinAssertionClass.add_public_method('assert_object_size', {}, DevaptMixinAssertion.assert_object_size);
	
	DevaptMixinAssertionClass.add_public_method('assert_array', {}, DevaptMixinAssertion.assert_array);
	DevaptMixinAssertionClass.add_public_method('assert_array', {}, DevaptMixinAssertion.assert_array);
	DevaptMixinAssertionClass.add_public_method('assert_array_size', {}, DevaptMixinAssertion.assert_array_size);
	DevaptMixinAssertionClass.add_public_method('assert_array_size', {}, DevaptMixinAssertion.assert_array_size);
	DevaptMixinAssertionClass.add_public_method('assert_not_empty_array', {}, DevaptMixinAssertion.assert_not_empty_array);
	DevaptMixinAssertionClass.add_public_method('assert_not_empty_array', {}, DevaptMixinAssertion.assert_not_empty_array);
	DevaptMixinAssertionClass.add_public_method('assert_not_empty_object_or_array', {}, DevaptMixinAssertion.assert_not_empty_object_or_array);
	DevaptMixinAssertionClass.add_public_method('assert_not_empty_object_or_array', {}, DevaptMixinAssertion.assert_not_empty_object_or_array);
	
	DevaptMixinAssertionClass.add_public_method('assert_not_empty_string', {}, DevaptMixinAssertion.assert_not_empty_string);
	DevaptMixinAssertionClass.add_public_method('assert_not_empty_string', {}, DevaptMixinAssertion.assert_not_empty_string);
	DevaptMixinAssertionClass.add_public_method('assert_not_empty_value', {}, DevaptMixinAssertion.assert_not_empty_value);
	DevaptMixinAssertionClass.add_public_method('assert_not_empty_value', {}, DevaptMixinAssertion.assert_not_empty_value);
	
	
	DevaptMixinAssertionClass.build_class();
	
	return DevaptMixinAssertionClass;
} );