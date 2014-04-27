/**
 * @file        core/storage-api.js
 * @desc        Devapt storage engines base class features
 * @ingroup     DEVAPT_CORE
 * @date        2014-04-21
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/object'], function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses, DevaptInheritance)
{
	/**
	 * @memberof	DevaptStorage
	 * @public
	 * @class
	 * @desc		Devapt resources loading features container
	 */
	var DevaptStorage = function(arg_name, arg_trace, arg_options) {
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_name, arg_trace, arg_options, 'DevaptStorage');
		
		
		// CONSTRUCTOR BEGIN
		var context = 'DevaptStorage(' + arg_name + ')';
		DevaptTraces.trace_enter(context, 'constructor', arg_trace);
		
		// STORAGE ATTRIBUTES
		self.is_valid = false;
		
		// CONSTRUCTOR END
		DevaptTraces.trace_leave(context, 'constructor', arg_trace);
		
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.toString()
		 * @desc					Get a string output of the object
		 * @return {string}			String output
		 */
		self.toString = function()
		{
			// return 'name=' + this.name;
			var str = self.class_name + '[';
			for(attribute_key in self)
			{
				var attribute = self[attribute_key];
				if (typeof attribute == 'function')
				{
					attribute = 'method';
				}
				str += '\n' + attribute_key + '=' + attribute;
			}
			str += '\n]';
			return str;
		}
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.to_string()
		 * @desc					Get a string output of the object
		 * @return {string}			String output
		 */
		self.to_string = function()
		{
			return self.toString();
		}
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.is_valid()
		 * @desc					Test if the storage engine is valid
		 * @return {boolean}		Is valid ?
		 */
		self.is_valid = function()
		{
			return self.is_valid;
		}
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.read_all_records(arg_success_callback, arg__error_callback)
		 * @desc					Read all records along storage strategy
		 * @param {callback}		arg_success_callback	Callback on success
		 * @param {callback}		arg_error_callback		Callback on error
		 * @return {boolean}		Read operation is valid ?
		 */
		self.read_all_records = function (arg_success_callback, arg_error_callback)
		{
		}
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.read(arg_query, arg_success_callback, arg_error_callback)
		 * @desc					Read records of the given query along storage strategy (async mode)
		 * @param {object}			arg_query				Read query
		 * @param {callback}		arg_success_callback	Callback on success
		 * @param {callback}		arg_error_callback		Callback on error
		 * @return {boolean}		Read operation is valid ?
		 */
		self.read = function (arg_query, arg_success_callback, arg__error_callback)
		{
		}
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.read_sync(arg_query, arg_success_callback, arg__error_callback)
		 * @desc					Read records of the given query along storage strategy (sync mode)
		 * @param {object}			arg_query				Read query
		 * @param {callback}		arg_success_callback	Callback on success
		 * @param {callback}		arg_error_callback		Callback on error
		 * @return {boolean}		Read operation is valid ?
		 */
		self.read_sync = function(arg_query, arg_success_callback, arg__error_callback)
		{
		}
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.create_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Create one or more records with the given values (async mode)
		 * @param {object|array}	arg_records				Records of values
		 * @param {callback}		arg_success_callback	Callback on success
		 * @param {callback}		arg_error_callback		Callback on error
		 * @return {boolean}		Create operation is valid ?
		 */
		self.create_records = function (arg_records, arg_success_callback, arg_error_callback)
		{
		}
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.update_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Update one or more records with the given values (async mode)
		 * @param {object|array}	arg_records				Records of values
		 * @param {callback}		arg_success_callback	Callback on success
		 * @param {callback}		arg_error_callback		Callback on error
		 * @return {boolean}		Update operation is valid ?
		 */
		this.update_records = function (arg_records, arg_success_callback, arg_error_callback)
		{
		}
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.delete_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Delete one or more records with the given values (async mode)
		 * @param {object|array}	arg_records				Records of values
		 * @param {callback}		arg_success_callback	Callback on success
		 * @param {callback}		arg_error_callback		Callback on error
		 * @return {boolean}		Delete operation is valid ?
		 */
		self.delete_records = function (arg_records, arg_success_callback, arg_error_callback)
		{
		}
	};
	