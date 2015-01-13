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

'use strict';
define(['Devapt', 'core/types', 'core/class', 'datas/storage-api'],
function(Devapt, DevaptTypes, DevaptClass, DevaptStorage)
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
	
	
	/**
	 * @public
	 * @memberof			DevaptJsonStorage
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// self.trace=true;
		
		
		// API STORAGE ATTRIBUTES
		self.is_sync		= false;
		self.is_cached		= false;
		// self.cache_ttl		= null;
		
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
		
		// QUERIES RESULTS CACHE
		self.use_cached_queries = true;
		self.cached_queries = {};
		
		
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
	 * @method					DevaptJsonStorage.read_all_records(arg_success_callback, arg__error_callback)
	 * @desc					Read all records along storage strategy
	 * @return {object}			A promise
	 */
	var cb_read_all_records = function ()
	{
		var self = this;
		var context = 'read_all_records()';
		self.enter(context, '');
		
		
		// SEARCH CACHED QUERIES
		var query_key = 'all';
		if (self.use_cached_queries)
		{
			var query_promise = self.cached_queries[query_key];
			if (query_promise)
			{
				self.leave(context, self.msg_success_promise);
				return query_promise;
			}
		}
		
		
		// CREATE AJAX REQUEST
		// var url = self.url_read + '?query_api=2';
		var url = self.url_read;
		var ajax_settings = {
			contentType	: self.http_format + '; charset=' + self.http_charset,
			dataType	: self.data_type,
			async		: ! self.is_sync,
			cache		: self.is_cached,
			type		: (! self.http_method_read || self.is_cached) ? 'GET' : self.http_method_read,
			url			: url,
			timeout		: self.http_timeout,
			data		: null
		};
		// console.log(ajax_settings);
		
		var ajax_promise = $.ajax(ajax_settings);
		// console.log(ajax_promise);
		
		
		// REGISTER CACHED QUERY
		if (self.use_cached_queries)
		{
			self.cached_queries[query_key] = ajax_promise;
		}
		
		
		// ON SUCCESS
		ajax_promise.done(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				if (self.notify_read)
				{
					Devapt.get_current_backend().notify_info('storage json: read all is done for [' + self.name + ']');
				}
			}
		);
		
		
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
		
		
		self.leave(context, self.msg_success_promise);
		return ajax_promise;
	};
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
	var cb_read_records = function (arg_query)
	{
		var self = this;
		var context = 'read_records(query)';
		self.enter(context, '');
		
		
		// SEARCH CACHED QUERIES
		var query_key = DevaptTypes.is_object(arg_query) ? arg_query.get_key() : null;
		// console.log(query_key, 'query key');
		if (query_key && self.use_cached_queries)
		{
			var query_promise = self.cached_queries[query_key];
			if (query_promise)
			{
				// console.log(query_key, 'cached query');
				self.leave(context, self.msg_success_promise);
				return query_promise;
			}
		}
		
		
		// CREATE AJAX REQUEST
		var json_datas = arg_query ? arg_query.get_json() : null;
		// var url = self.url_read + '?query_api=2';
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
				data		: json_datas
			}
		);
		
		
		// REGISTER CACHED QUERY
		if (query_key && self.use_cached_queries)
		{
			// console.log(query_key, 'save query');
			self.cached_queries[query_key] = ajax_promise;
		}
		
		
		// ON SUCCESS
		ajax_promise.done(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				if (self.notify_read)
				{
					Devapt.get_current_backend().notify_info('storage json: read query is done for [' + self.name + ']');
				}
			}
		);
		
		
		// ON FAILURE
		ajax_promise.fail(
			function(result)
			{
				// console.error(result, 'storage-json.result');
				
				self.cached_queries[query_key] = null;
				delete self.cached_queries[query_key];
				
				Devapt.get_current_backend().notify_error('storage json: read query has failed for [' + self.name + ']');
			}
		);
		
		
		self.leave(context, self.msg_success_promise);
		return ajax_promise;
	};
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
		// var url = self.url_create + '?query_api=2';
		var url = self.url_create;
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
		
		ajax_promise.done(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				if (self.notify_create)
				{
					Devapt.get_current_backend().notify_info('storage json: create is done for [' + self.name + ']');
				}
			}
		);
		
		ajax_promise.fail(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				Devapt.get_current_backend().notify_error('storage json: create has failed for [' + self.name + ']');
			}
		);
		
		
		self.leave(context, self.msg_success_promise);
		return ajax_promise;
	};
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
		// var url = self.url_update + '?query_api=2';
		var url = self.url_update;
		var ajax_promise = $.ajax(
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
		
		ajax_promise.done(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				if (self.notify_update)
				{
					Devapt.get_current_backend().notify_info('storage json: update is done for [' + self.name + ']');
				}
			}
		);
		
		ajax_promise.fail(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				Devapt.get_current_backend().notify_error('storage json: update has failed for [' + self.name + ']');
			}
		);
		
		
		self.leave(context, self.msg_success_promise);
		return ajax_promise;
	};
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
		// var url = self.url_delete + '?query_api=2';
		var url = self.url_delete;
		var ajax_promise = $.ajax(
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
		
		ajax_promise.done(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				if (self.notify_delete)
				{
					Devapt.get_current_backend().notify_info('storage json: delete is done');
				}
			}
		);
		
		ajax_promise.fail(
			function(result)
			{
				// console.log(result, 'storage-json.result');
				Devapt.get_current_backend().notify_error('storage json: delete has failed');
			}
		);
		
		
		self.leave(context, self.msg_success_promise);
		return ajax_promise;
	};
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
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-08-12',
			updated:'2014-12-14',
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
	DevaptStorageClass.add_public_method('read_all_records', {}, cb_read_all_records);
	DevaptStorageClass.add_public_method('read_records', {}, cb_read_records);
	DevaptStorageClass.add_public_method('create_records', {}, cb_create_records);
	DevaptStorageClass.add_public_method('update_records', {}, cb_update_records);
	DevaptStorageClass.add_public_method('delete_records', {}, cb_delete_records);
	
	// MIXINS
	
	// PROPERTIES
	DevaptStorageClass.add_public_str_property('source', 'source of datas', null, true, true, []);
	
	DevaptStorageClass.add_public_str_property('notify_create', 'notify user on create operations', true, false, false, []);
	DevaptStorageClass.add_public_str_property('notify_read', 'notify user on read operations', false, false, false, []);
	DevaptStorageClass.add_public_str_property('notify_update', 'notify user on update operations', true, false, false, []);
	DevaptStorageClass.add_public_str_property('notify_delete', 'notify user on delete operations', true, false, false, []);
	
	DevaptStorageClass.add_public_str_property('url_create', 'url for create operation', null, true, true, []);
	DevaptStorageClass.add_public_str_property('url_read', 'url for create operation', null, true, true, []);
	DevaptStorageClass.add_public_str_property('url_update', 'url for create operation', null, true, true, []);
	DevaptStorageClass.add_public_str_property('url_delete', 'url for create operation', null, true, true, []);
	
	DevaptStorageClass.add_public_str_property('http_method_create', 'HTTP method for create operation', 'PUT', false, true, []);
	DevaptStorageClass.add_public_str_property('http_method_read', 'HTTP method for create operation', 'GET', false, true, []);
	DevaptStorageClass.add_public_str_property('http_method_update', 'HTTP method for create operation', 'POST', false, true, []);
	DevaptStorageClass.add_public_str_property('http_method_delete', 'HTTP method for create operation', 'DELETE', false, true, []);
	
	
	return DevaptStorageClass;
} );