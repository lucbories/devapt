/**
 * @file        datas/storage/storage-json.js
 * @desc        Devapt JSON storage engine
 *                  ->is_valid()              : boolean
 *                  ->read_all_records()      : promise of a ResultSet
 *                  ->read_all_records_self() : promise of a ResultSet (internal method)
 *                  ->read_records(query)     : promise of a ResultSet
 *                  ->read_records_self(query): promise of a ResultSet (internal method)
 *                  ->create_records(query)   : promise of a ResultSet
 *                  ->update_records(query)   : promise of a ResultSet
 *                  ->delete_records(query)   : promise of a ResultSet
 * 
 * @ingroup     DEVAPT_DATAS
 * @date        2014-08-12
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types', 'object/class', 'datas/storage/storage', 'datas/storage/resultset'],
function(Devapt, DevaptTypes, DevaptClass, DevaptStorage, DevaptResultSet)
{
	/**
	 * @public
	 * @class				DevaptJsonStorage
	 * @desc				JSON storage engine class
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptJsonStorage
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// DEBUG
		// self.trace=true;
		
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// STORAGE ATTRIBUTES
		self.is_sync		= false;
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	/**
	 * @memberof				DevaptJsonStorage
	 * @public
	 * @method					DevaptJsonStorage.is_valid()
	 * @desc					Test if the storage engine is valid
	 * @return {boolean}		Is valid ?
	 */
	var cb_is_valid = function()
	{
		// TODO
		return true;
	};
	
	
	
	/**
	 * @memberof				DevaptJsonStorage
	 * @public
	 * @method					DevaptJsonStorage.read_all_records()
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptJsonStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_update:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_delete:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/'
	 * 					};
	 * 					var store = new DevaptJsonStorage('store', store_opts);
	 * 					store.read_all_records().then( function(result) { console.log(result, 'result'); } );
	 * 				}
	 * 			);
	 * 
	 * @desc					Read all records along storage strategy
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_read_all_records_self = function ()
	{
		var self = this;
		// self.trace=true;
		var context = 'read_all_records_self()';
		self.enter(context, '');
		
		
		try
		{
			// INIT URL AND DATAS
			var url = self.url_read;
			var json_datas = {};
			var token = Devapt.app.get_security_token();
			
			// INIT REQUEST SETTINGS
			var ajax_settings = {
				contentType	: self.http_format + '; charset=' + self.http_charset,
				dataType	: self.http_data_type,
				async		: ! self.is_sync,
				cache		: self.is_cached,
				timeout		: self.http_timeout
			};
			var method = (! self.http_method_read || self.is_cached) ? 'GET' : self.http_method_read;
			self.value(context, 'method', method);
			
			// SEND REQUEST
			var ajax_promise = Devapt.ajax(method, url, JSON.stringify(json_datas), ajax_settings, token);
			
			// ON SUCCESS
			if (self.notify_read)
			{
				ajax_promise.then(
					function(result)
					{
						// console.log(result, 'storage-json.result');
						Devapt.get_current_backend().notify_info('storage json: read all is done for [' + self.name + ']');
					}
				);
			}
			
			
			// ON FAILURE
			ajax_promise.fail(
				function(result)
				{
					// console.log(result, 'storage-json.result');
					
					self.cached_queries[query_key] = null;
					delete self.cached_queries[query_key];
					
					Devapt.get_current_backend().notify_error('storage json: read all has failed for [' + self.name + ']');
				}
			);
			
			// RETURN A RESULT SET
			var resultset_promise = ajax_promise.then(
				function(result)
				{
					return DevaptResultSet.create(self.name + '_result_read_all', result);
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		self.leave(context, self.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptJsonStorage
	 * @public
	 * @method					DevaptJsonStorage.read_records(arg_query)
	 * @desc					Read records of the given query along storage strategy (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptJsonStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_update:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_delete:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/'
	 * 					};
	 * 					var store = new DevaptJsonStorage('store', store_opts);
	 * 					var query = DevaptQuery.create('query_1', {...});
	 * 					store.read_records(query).then( function(result) { console.log(result, 'result'); } );
	 * 				}
	 * 			);
	 * 
	 * @param {object}			arg_query		Read query
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_read_records_self = function (arg_query)
	{
		var self = this;
		// self.trace=true;
		var context = 'read_records_self(query)';
		self.enter(context, '');
		// console.log(arg_query, 'jsonstorage.arg_query');
		
		
		try
		{
			// CREATE AJAX REQUEST
			var json_datas = arg_query ? arg_query.get_json() : null;
			var token = Devapt.app.get_security_token();
			
			var url = self.url_read;
			
			var ajax_settings = {
				contentType	: self.http_format + '; charset=' + self.http_charset,
				dataType	: self.http_data_type,
				async		: ! self.is_sync,
				cache		: self.is_cached,
				timeout		: self.http_timeout
			};
			var method = (! self.http_method_read || self.is_cached) ? 'GET' : self.http_method_read;
			var ajax_promise = Devapt.ajax(method, url, JSON.stringify(json_datas), ajax_settings, token);
			
			// ON SUCCESS
			if (self.notify_read)
			{
				ajax_promise.then(
					function(result)
					{
						// console.log(result, 'storage-json.result');
						
						Devapt.get_current_backend().notify_info('storage json: read query is done for [' + self.name + ']');
					}
				);
			}
			
			
			// ON FAILURE
			ajax_promise.fail(
				function(result)
				{
					// console.error(result, 'storage-json.result');
					var query_key = 'all';
					self.cached_queries[query_key] = null;
					delete self.cached_queries[query_key];
					
					Devapt.get_current_backend().notify_error('storage json: read query has failed for [' + self.name + ']');
				}
			);
			
			// RETURN A RESULT SET
			var resultset_promise = ajax_promise.then(
				function(result)
				{
					// console.log(result);
					return DevaptResultSet.create(self.name + '_result_read_' + arg_query.name, result);
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		self.leave(context, self.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptJsonStorage
	 * @public
	 * @method					DevaptJsonStorage.create_records(arg_records)
	 * @desc					Create one or more records with the given values (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptJsonStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_update:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_delete:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/'
	 * 					};
	 * 					var record = {"id_user":null,"login":"jcarter","lastname":"CARTER","firstname":"Jimmy","email":"jcarter@usa.us","password":"mypass"};
	 * 					var store = new DevaptJsonStorage('store', store_opts);
	 * 					store.create_records(record).then( function(result) { console.log(result, 'result'); } );
	 * 				}
	 * 			);
	 * 
	 * @param {object|array}	arg_records		Records of values
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_create_records = function (arg_records)
	{
		var self = this;
		var context = 'create_records(records)';
		self.enter(context, '');
		
		
		// CREATE AJAX REQUEST
		var json_datas =
			{
				query_json: {
					action: 'insert',
					query_type: 'insert',
					values: arg_records,
					values_count: arg_records.length
				}
			};
		var token = Devapt.app.get_security_token();
		
		var url = self.url_create;
		var ajax_settings = {
			contentType	: self.http_format + '; charset=' + self.http_charset,
			dataType	: 'json',
			async		: ! self.is_sync,
			cache		: false,
			timeout		: self.http_timeout
		};
		var method = self.http_method_create;
		var ajax_promise = Devapt.ajax(method, url, JSON.stringify(json_datas), ajax_settings, token);
		
		ajax_promise.done(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				if (self.notify_create)
				{
					Devapt.get_current_backend().notify_info('storage json: create is done for [' + self.name + ']');
				}
				
				// Update cache of queries results
				self.touch_cached_records(arg_records, 'create');
			}
		);
		
		ajax_promise.fail(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				Devapt.get_current_backend().notify_error('storage json: create has failed for [' + self.name + ']');
			}
		);
		
		// RETURN A RESULT SET
		var resultset_promise = ajax_promise.then(
			function(result)
			{
				return DevaptResultSet.create(self.name + '_result_create', result);
			}
		);
		
		
		self.leave(context, self.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptJsonStorage
	 * @public
	 * @method					DevaptJsonStorage.update_records(arg_records)
	 * @desc					Update one or more records with the given values (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptJsonStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_update:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_delete:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/'
	 * 					};
	 * 					var store = new DevaptJsonStorage('store', store_opts);
	 * 					var record = {"id_user":"31","password":"mypass2"};
	 * 					store.update_records(record).then( function(result) { console.log(result, 'result'); } );
	 * 				}
	 * 			);
	 * 
	 * @param {object|array}	arg_records		Records of values
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_update_records = function (arg_records)
	{
		var self = this;
		var context = 'update_records(records)';
		self.enter(context, '');
		
		
		// CREATE AJAX REQUEST
		var json_datas =
		{
			query_json: {
				action: 'update',
				query_type: 'update',
				values: arg_records,
				values_count: 1
			}
		};
		var token = Devapt.app.get_security_token();
		
		var url = self.url_update;
		var jq_ajax_promise = $.ajax(
			{
				contentType	: self.http_format + '; charset=' + self.http_charset,
				dataType	: 'json',
				async		: ! self.is_sync,
				cache		: false,
				type		: self.http_method_update,
				url			: url,
				timeout		: self.http_timeout,
				data		: JSON.stringify(json_datas)
			}
		);
		var ajax_promise = Devapt.promise(jq_ajax_promise);
		
		ajax_promise.done(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				if (self.notify_update)
				{
					Devapt.get_current_backend().notify_info('storage json: update is done for [' + self.name + ']');
				}
				
				// Update cache of queries results
				self.touch_cached_records(arg_records, 'update');
			}
		);
		
		ajax_promise.fail(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				Devapt.get_current_backend().notify_error('storage json: update has failed for [' + self.name + ']');
			}
		);
		
		// RETURN A RESULT SET
		var resultset_promise = ajax_promise.then(
			function(result)
			{
				return DevaptResultSet.create(self.name + '_result_update', result);
			}
		);
		
		
		self.leave(context, self.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptJsonStorage
	 * @public
	 * @method					DevaptJsonStorage.delete_records(arg_records)
	 * @desc					Delete one or more records with the given values (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptJsonStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_update:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_delete:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/'
	 * 					};
	 * 					var store = new DevaptJsonStorage('store', store_opts);
	 * 					var record = {"id_user":"31"};
	 * 					store.delete_records(record).then( function(result) { console.log(result, 'result'); } );
	 * 				}
	 * 			);
	 * 
	 * @param {object|array}	arg_records		Records of values
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_delete_records = function (arg_records)
	{
		var self = this;
		var context = 'update_records(records)';
		self.enter(context, '');
		
		
		// CREATE AJAX REQUEST
		var json_datas =
		{
			query_json: {
				action: 'delete',
				query_type: 'delete',
				values: arg_records,
				values_count: 1
			}
		};
		var token = Devapt.app.get_security_token();
		
		var url = self.url_delete;
		var jq_ajax_promise = $.ajax(
			{
				contentType	: self.http_format + '; charset=' + self.http_charset,
				dataType	: 'json',
				async		: ! self.is_sync,
				cache		: false,
				type		: self.http_method_delete,
				url			: url,
				timeout		: self.http_timeout,
				data		: JSON.stringify(json_datas)
			}
		);
		var ajax_promise = Devapt.promise(jq_ajax_promise);
		
		ajax_promise.done(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				if (self.notify_delete)
				{
					Devapt.get_current_backend().notify_info('storage json: delete is done');
				}
				
				// Update cache of queries results
				self.touch_cached_records(arg_records, 'delete');
			}
		);
		
		ajax_promise.fail(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				Devapt.get_current_backend().notify_error('storage json: delete has failed');
			}
		);
		
		// RETURN A RESULT SET
		var resultset_promise = ajax_promise.then(
			function(result)
			{
				return DevaptResultSet.create(self.name + '_result_delete', result);
			}
		);
		
		
		self.leave(context, self.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-08-12',
			updated:'2015-02-02',
			description:'JSON remote storage engine.'
		},
		properties:{
		}
	};
	var parent_class = DevaptStorage;
	var DevaptStorageClass = new DevaptClass('DevaptJsonStorage', parent_class, class_settings);
	
	// METHODS
	DevaptStorageClass.infos.ctor = cb_constructor;
	DevaptStorageClass.add_public_method('is_valid', {}, cb_is_valid);
	DevaptStorageClass.add_public_method('read_all_records_self', {}, cb_read_all_records_self);
	DevaptStorageClass.add_public_method('read_records_self', {}, cb_read_records_self);
	DevaptStorageClass.add_public_method('create_records', {}, cb_create_records);
	DevaptStorageClass.add_public_method('update_records', {}, cb_update_records);
	DevaptStorageClass.add_public_method('delete_records', {}, cb_delete_records);
	
	// MIXINS
	
	// PROPERTIES
	DevaptStorageClass.add_public_str_property('source', 'source of datas', null, true, true, []);
	
	DevaptStorageClass.add_public_str_property('url_create', 'url for create operation', null, true, true, []);
	DevaptStorageClass.add_public_str_property('url_read', 'url for create operation', null, true, true, []);
	DevaptStorageClass.add_public_str_property('url_update', 'url for create operation', null, true, true, []);
	DevaptStorageClass.add_public_str_property('url_delete', 'url for create operation', null, true, true, []);
	
	DevaptStorageClass.add_public_str_property('http_method_create', 'HTTP method for create operation', 'PUT', false, true, []);
	DevaptStorageClass.add_public_str_property('http_method_read', 'HTTP method for create operation', 'GET', false, true, []);
	DevaptStorageClass.add_public_str_property('http_method_update', 'HTTP method for create operation', 'POST', false, true, []);
	DevaptStorageClass.add_public_str_property('http_method_delete', 'HTTP method for create operation', 'DELETE', false, true, []);
	
	DevaptStorageClass.add_public_str_property('http_timeout', 'timeout of HTTP requests (milliseconds)', 5000, false, false, []);
	DevaptStorageClass.add_public_str_property('http_charset', 'charset of HTTP requests', 'utf-8', false, false, []);
	DevaptStorageClass.add_public_str_property('http_format', 'data result format of HTTP requests', 'application/x-www-form-urlencoded', false, false, []);
	DevaptStorageClass.add_public_str_property('http_data_type', 'data request type of HTTP requests', 'jsonp', false, false, []);
	DevaptStorageClass.add_public_str_property('http_data_name', 'data request type of HTTP requests', 'json_datas', false, false, []);
	
	
	return DevaptStorageClass;
} );