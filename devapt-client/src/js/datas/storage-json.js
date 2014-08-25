/**
 * @file        datas/storage-json.js
 * @desc        Devapt JSON storage engine
 * 				var jqXHR = $.ajax(...);
 * 				=>	jqXHR.done(function( data, textStatus, jqXHR ) {});
 * 					jqXHR.fail(function( jqXHR, textStatus, errorThrown ) {});
 * 					jqXHR.always(function( data|jqXHR, textStatus, jqXHR|errorThrown ) { });
 * 					jqXHR.then(function( data, textStatus, jqXHR ) {}, function( jqXHR, textStatus, errorThrown ) {});
 * 
 * 
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/object'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptOptions, DevaptClasses, DevaptObject)
{
	/**
	 * @public
	 * @class				DevaptJsonStorage
	 * @desc				JSON storage engine class
	 * @param {string}		arg_name			Engine name (string)
	 * @param {object}		arg_datas_array		Initial datas array
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptJsonStorage(arg_name, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptObject;
		self.inheritFrom(arg_name, arg_options, false);
		
		// INIT
		self.trace				= true;
		self.class_name			= 'DevaptJsonStorage';
		self.is_storage			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptJsonStorage
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptJsonStorage_contructor = function()
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
			self.is_sync		= false;
			self.is_cached		= false;
			self.cache_ttl		= null;
			
			// JSON STORAGE ATTRIBUTES
			// self.http_method_read	= 'GET';
			// self.http_method_create	= 'PUT';
			// self.http_method_update	= 'POST';
			// self.http_method_delete	= 'DELETE';
			
			self.http_timeout	= 5000; // milliseconds
			self.http_charset	= 'utf-8';
			self.http_format	= 'application/x-www-form-urlencoded';
			self.data_type		= 'jsonp';
			// self.data_name		= 'json_datas';
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CONSTRUCTOR END
		self.DevaptJsonStorage_contructor();
		
		
		
		/**
		 * @memberof				DevaptJsonStorage
		 * @public
		 * @method					DevaptJsonStorage.read_all_records(arg_success_callback, arg__error_callback)
		 * @desc					Read all records along storage strategy
		 * @return {object}			A promise
		 */
		self.read_all_records = function ()
		{
			var self = this;
			var context = 'read_all_records()';
			self.enter(context, '');
			
			
			// CREATE AJAX REQUEST
			var url = self.url_read;
			var ajax_promise = $.ajax(
				{
					contentType	: self.http_format + '; charset=' + self.http_charset,
					dataType	: self.data_type,
					async		: ! self.is_sync,
					cache		: self.is_cached,
					type		: (! self.http_method_read || self.is_cached) ? 'GET' : self.http_method_read,
					url			: url,
					timeout		: self.http_timeout,
					data		: null
				}
			);
			
			
			self.leave(context, self.msg_success_promise);
			return ajax_promise;
		}
		/*
			TEST:
			require(['datas/storage-json'],
			function(DevaptJsonStorage) {
				var store_opts = { url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/', url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/', url_uprate:'', url_delete:'' };
				var store = new DevaptJsonStorage('store', store_opts);
				store.read_all_records().then( function(result) { console.log(result, 'result'); } );
			} );
		*/
		
		/**
		 * @memberof				DevaptJsonStorage
		 * @public
		 * @method					DevaptJsonStorage.read_records(arg_query, arg_success_callback, arg_error_callback)
		 * @desc					Read records of the given query along storage strategy (async mode)
		 * @param {object}			arg_query		Read query
		 * @return {object}			A promise
		 */
		self.read_records = function (arg_query)
		{
			var self = this;
			var context = 'read_records(query)';
			self.enter(context, '');
			
			
			// CREATE AJAX REQUEST
			// var json_datas = arg_query.get_json();
			var json_datas = {
				query_json: {
					action: 'select_count',
					one_field: 'id_user',
					values: null,
					values_count: 0
				}
			};
			var url = self.url_read + '?query_api=2';
			var ajax_promise = $.ajax(
				{
					contentType	: self.http_format + '; charset=' + self.http_charset,
					dataType	: self.data_type,
					async		: ! self.is_sync,
					cache		: self.is_cached,
					type		: (! self.http_method_read || self.is_cached) ? 'GET' : self.http_method_read,
					url			: url,
					timeout		: self.http_timeout,
					data		: json_datas
				}
			);
			
			
			self.leave(context, self.msg_success_promise);
			return ajax_promise;
		}
		/*
			TEST:
			require(['datas/storage-json'],
			function(DevaptJsonStorage) {
				var store_opts = { url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/', url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/', url_uprate:'', url_delete:'' };
				var store = new DevaptJsonStorage('store', store_opts);
				var query = null;
				store.read_records(query).then( function(result) { console.log(result, 'result'); } );
			} );
		*/
		
		
		/**
		 * @memberof				DevaptJsonStorage
		 * @public
		 * @method					DevaptJsonStorage.create_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Create one or more records with the given values (async mode)
		 * @param {object|array}	arg_records		Records of values
		 * @return {object}			A promise
		 */
		self.create_records = function (arg_records)
		{
			var self = this;
			var context = 'create_records(records)';
			self.enter(context, '');
			
			
			// CREATE AJAX REQUEST
			var json_datas =
				{
					query_json: {
						action: 'insert',
						values: arg_records,
						values_count: 1
					}
				};
			var url = self.url_create + '?query_api=2';
			var ajax_promise = $.ajax(
				{
					contentType	: self.http_format + '; charset=' + self.http_charset,
					dataType	: 'json',
					async		: ! self.is_sync,
					cache		: false,
					type		: self.http_method_create,
					url			: url,
					timeout		: self.http_timeout,
					data		: JSON.stringify(json_datas)
				}
			);
			
			
			self.leave(context, self.msg_success_promise);
			return ajax_promise;
		}
		/*
			TEST:
			require(['datas/storage-json'],
			function(DevaptJsonStorage) {
				var store_opts={ url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/', url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/', url_uprate:'', url_delete:'' };
				var store=new DevaptJsonStorage('store', store_opts);
				var record = {"id_user":null,"login":"jcarter","lastname":"CARTER","firstname":"Jimmy","email":"jcarter@usa.us","password":"mypass"};
				store.create_records(record).then( function(result) { console.log(result, 'result'); } );
			} );
		*/
		
		
		/**
		 * @memberof				DevaptJsonStorage
		 * @public
		 * @method					DevaptJsonStorage.update_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Update one or more records with the given values (async mode)
		 * @param {object|array}	arg_records		Records of values
		 * @return {object}			A promise
		 */
		self.update_records = function (arg_records)
		{
			var self = this;
			var context = 'update_records(records)';
			self.enter(context, '');
			
			
			// CREATE AJAX REQUEST
			var json_datas =
				{
					query_json: {
						action: 'update',
						values: arg_records,
						values_count: 1
					}
				};
			var url = self.url_create + '?query_api=2';
			var ajax_promise = $.ajax(
				{
					contentType	: self.http_format + '; charset=' + self.http_charset,
					dataType	: 'json',
					async		: ! self.is_sync,
					cache		: false,
					type		: self.http_method_create,
					url			: url,
					timeout		: self.http_timeout,
					data		: JSON.stringify(json_datas)
				}
			);
			
			
			self.leave(context, self.msg_success_promise);
			return ajax_promise;
		}
		/*
			TEST:
			require(['datas/storage-json'],
			function(DevaptJsonStorage) {
				var store_opts={ url_read:'', url_create:'', url_uprate:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/', url_delete:'' };
				var store=new DevaptJsonStorage('store', store_opts);
				var record = {"id_user":"31","password":"mypass2"};
				store.update_records(record).then( function(result) { console.log(result, 'result'); } );
			} );
		*/
		
		
		/**
		 * @memberof				DevaptJsonStorage
		 * @public
		 * @method					DevaptJsonStorage.delete_records(arg_records, arg_success_callback, arg_error_callback)
		 * @desc					Delete one or more records with the given values (async mode)
		 * @param {object|array}	arg_records		Records of values
		 * @return {object}			A promise
		 */
		self.delete_records = function (arg_records)
		{
			var self = this;
			var context = 'update_records(records)';
			self.enter(context, '');
			
			
			// CREATE AJAX REQUEST
			var json_datas =
				{
					query_json: {
						action: 'delete',
						values: arg_records,
						values_count: 1
					}
				};
			var url = self.url_create + '?query_api=2';
			var ajax_promise = $.ajax(
				{
					contentType	: self.http_format + '; charset=' + self.http_charset,
					dataType	: 'json',
					async		: ! self.is_sync,
					cache		: false,
					type		: self.http_method_create,
					url			: url,
					timeout		: self.http_timeout,
					data		: JSON.stringify(json_datas)
				}
			);
			
			
			self.leave(context, self.msg_success_promise);
			return ajax_promise;
		}
		/*
			TEST:
			require(['datas/storage-json'],
			function(DevaptJsonStorage) {
				var store_opts={ url_read:'', url_create:'', url_uprate:'', url_delete:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/' };
				var store=new DevaptJsonStorage('store', store_opts);
				var record = {"id_user":"31"};
				store.delete_records(record).then( function(result) { console.log(result, 'result'); } );
			} );
		*/
	};
	
	
	// INTROSPECTION : REGISTER CLASS
	DevaptClasses.register_class(DevaptJsonStorage, ['DevaptObject'], 'Luc BORIES', '2014-08-12', 'JSON remote storage engine.');
	
	
	// INTROSPECTION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptJsonStorage, 'url_create',			null, true, []);
	DevaptOptions.register_str_option(DevaptJsonStorage, 'url_read',			null, true, []);
	DevaptOptions.register_str_option(DevaptJsonStorage, 'url_update',			null, true, []);
	DevaptOptions.register_str_option(DevaptJsonStorage, 'url_delete',			null, true, []);
	
	DevaptOptions.register_str_option(DevaptJsonStorage, 'http_method_create',	'PUT', false, []);
	DevaptOptions.register_str_option(DevaptJsonStorage, 'http_method_read',	'GET', false, []);
	DevaptOptions.register_str_option(DevaptJsonStorage, 'http_method_update',	'POST', false, []);
	DevaptOptions.register_str_option(DevaptJsonStorage, 'http_method_delete',	'DELETE', false, []);
	
	
	return DevaptJsonStorage;
} );