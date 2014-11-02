/**
 * @file        datas/storage-memory.js
 * @desc        Devapt memory storage engine
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
	 * @class				DevaptMemoryStorage
	 * @desc				Memory storage engine class
	 * @param {string}		arg_name			Engine name (string)
	 * @param {object}		arg_datas_array		Initial datas array
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptMemoryStorage(arg_name, arg_datas_array, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_name, arg_options, false);
		
		// INIT
		self.trace				= true;
		self.class_name			= 'DevaptMemoryStorage';
		self.is_storage			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptMemoryStorage
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptMemoryStorage_contructor = function()
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
			self.is_valid		= false;
			self.is_sync		= true;
			self.is_cached		= false;
			self.cache_ttl		= null;
			
			// MEMORY STORAGE ATTRIBUTES
			self.datas_array			= DevaptTypes.is_array(arg_datas_array) ? arg_datas_array : [];
			self.is_flat_array			= false;
			self.flat_array_field_name	= null;
			self.get_records_cb			= null;
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CONSTRUCTOR END
		DevaptTraces.DevaptMemoryStorage_contructor();
	
	
	
		/**
		 * @public
		 * @method				set_datas_array(arg_datas_array)
		 * @desc				Set engine datas array
		 * @param {array}		arg_datas_array
		 * @return {object}		This
		 */
		self.set_datas_array = function(arg_datas_array)
		{
			var self = this;
			var context = 'set_datas_array(arg_datas_array)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			if ( ! DevaptTypes.is_array(arg_datas_array) && ! DevaptTypes.is_callback( self.get_records_cb ))
			{
				self.error(context, 'arg_datas_array is not an array');
				return self;
			}
			
			// SET DATAS
			self.datas_array = arg_datas_array;
			
			
			self.leave(context, 'success');
			return self;
		}
	
	
	
		/**
		 * @public
		 * @method				get_datas_array()
		 * @desc				Get engine datas array
		 * @return {array}		All engine records
		 */
		self.get_datas_array = function()
		{
			var self = this;
			var context = 'get_datas_array()';
			self.enter(context, '');
			
			
			// ARRAY
			if ( DevaptTypes.is_array(self.datas_array) )
			{
				// WITH CALLBACK
				if ( DevaptTypes.is_callback(self.get_records_cb) )
				{
					self.leave(context, 'A records array with callback');
					return self.do_callback(self.get_records_cb, [self.datas_array]);
				}
				
				// WITHOUT CALLBACK
				self.leave(context, 'A records array without callback');
				return self.datas_array;
			}
			
			
			self.leave(context, 'failure');
			return null;
		}
		
		
		
		/**
		 * @memberof				DevaptMemoryStorage
		 * @public
		 * @method					DevaptMemoryStorage.read_all_records(arg_success_callback, arg__error_callback)
		 * @desc					Read all records along storage strategy
		 * @return {object}			A promise
		 */
		self.read_all_records = function ()
		{
			var self = this;
			var context = 'read_all_records()';
			self.enter(context, '');
			
			
			// CREATE REFERRED OBJECT
			var deferred = $.Deferred();
			
			// GET DATAS
			var datas_records = self.get_datas_array();
			
			// FAILURE
			if ( ! DevaptTypes.is_array(datas_records) )
			{
				deferred.reject();
				self.leave(context, self.msg_failure);
				return deferred.promise();
			}
			
			// SUCCESS
			deferred.resolve(datas_records);
			
			
			self.leave(context, self.msg_success);
			return deferred.promise();
		}
		
		
		/**
		 * @memberof				DevaptMemoryStorage
		 * @public
		 * @method					DevaptMemoryStorage.read_records(arg_query, arg_success_callback, arg_error_callback)
		 * @desc					Read records of the given query along storage strategy (async mode)
		 * @param {object}			arg_query		Read query
		 * @return {object}			A promise
		 */
		self.read_records = function (arg_query)
		{
			var self = this;
			var context = 'read_records(query)';
			self.enter(context, '');
			
			
			// TODO use query
			var promise = self.read_all_records();
			
			
			self.leave(context, 'async promise');
			return promise;
		}
		
		
		/**
		 * @memberof				DevaptMemoryStorage
		 * @public
		 * @method					DevaptMemoryStorage.create_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Create one or more records with the given values (async mode)
		 * @param {object|array}	arg_records		Records of values
		 * @return {object}			A promise
		 */
		self.create_records = function (arg_records)
		{
			// TODO
		}
		
		
		/**
		 * @memberof				DevaptMemoryStorage
		 * @public
		 * @method					DevaptMemoryStorage.update_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Update one or more records with the given values (async mode)
		 * @param {object|array}	arg_records		Records of values
		 * @return {object}			A promise
		 */
		self.update_records = function (arg_records)
		{
			// TODO
		}
		
		
		/**
		 * @memberof				DevaptMemoryStorage
		 * @public
		 * @method					DevaptMemoryStorage.delete_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Delete one or more records with the given values (async mode)
		 * @param {object|array}	arg_records		Records of values
		 * @return {object}			A promise
		 */
		self.delete_records = function (arg_records)
		{
			// TODO
		}
	}
	
	
	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptMemoryStorage, ['DevaptObject'], 'Luc BORIES', '2014-08-11', 'Memory storage engine.');
	
	
	// INTROSPECTION : REGISTER OPTIONS
	// DevaptOptions.register_str_option(DevaptMemoryStorage, '...',			null, false, []);
	
	
	return DevaptMemoryStorage;
}