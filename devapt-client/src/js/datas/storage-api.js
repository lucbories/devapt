/**
 * @file        datas/storage-api.js
 * @desc        Devapt storage engines base class features
 *              API:
 *                  ->is_valid()              : boolean
 *                  ->read_all_records()      : promise
 *                  ->read_records(query)     : promise
 *                  ->create_records(query)   : promise
 *                  ->update_records(query)   : promise
 *                  ->delete_records(query)   : promise
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-11
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/classes', 'core/object'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptClasses, DevaptObject)
{
	/**
	 * @public
	 * @class				DevaptStorage
	 * @desc				API for storage engine class
	 * @param {string}		arg_name			Engine name (string)
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptStorage(arg_name, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_name, arg_options, false);
		
		
		/**
		 * @public
		 * @memberof			DevaptStorage
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptStorage_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = self.class_name + '(' + arg_name + ')';
			self.enter(context, 'constructor');
			
			
			// INIT OPTIONS
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			if (! init_option_result)
			{
				self.error(context + ': init options failure');
			}
			
			
			// API STORAGE ATTRIBUTES
			self.is_sync		= true;
			self.is_cached		= false;
			self.cache_ttl		= null;
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		};
		
		
		// CONSTRUCTOR END
		DevaptTraces.DevaptStorage_contructor();
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.is_valid()
		 * @desc					Test if the storage engine is valid
		 * @return {boolean}		Is valid ?
		 */
		self.is_valid = function()
		{
			return false;
		};
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.read_all_records(arg_success_callback, arg__error_callback)
		 * @desc					Read all records along storage strategy
		 * @return {object}			A promise
		 */
		self.read_all_records = function ()
		{
			return null;
		};
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.read_records(arg_query, arg_success_callback, arg_error_callback)
		 * @desc					Read records of the given query along storage strategy (async mode)
		 * @param {object}			arg_query				Read query
		 * @return {object}			A promise
		 */
		self.read_records = function (arg_query)
		{
			return null;
		};
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.create_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Create one or more records with the given values (async mode)
		 * @param {object|array}	arg_records		Records of values
		 * @return {object}			A promise
		 */
		self.create_records = function (arg_records)
		{
			return null;
		};
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.update_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Update one or more records with the given values (async mode)
		 * @param {object|array}	arg_records		Records of values
		 * @return {object}			A promise
		 */
		self.update_records = function (arg_records)
		{
			return null;
		};
		
		
		/**
		 * @memberof				DevaptStorage
		 * @public
		 * @method					DevaptStorage.delete_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Delete one or more records with the given values (async mode)
		 * @param {object|array}	arg_records		Records of values
		 * @return {object}			A promise
		 */
		self.delete_records = function (arg_records)
		{
			return null;
		};
	}
	
	
	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptStorage, ['DevaptObject'], 'Luc BORIES', '2014-08-11', 'Storage engines base class.');
	
	
	// INTROSPECTION : REGISTER OPTIONS
	// DevaptOptions.register_str_option(DevaptJsonStorage, '...',			null, false, []);
	
	
	return DevaptStorage;
} );