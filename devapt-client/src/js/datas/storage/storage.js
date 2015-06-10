/**
 * @file        datas/storage.js
 * @desc        Devapt storage engines base class features
 *              API:
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
 * @date        2014-08-11
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types', 'object/class', 'object/object', 'datas/storage/resultset'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObject, DevaptResultSet)
{
	/**
	 * @public
	 * @class				DevaptStorage
	 * @desc				Storage engine base class
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptStorage
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// self.trace=true;
		
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// self.trace=true;
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.is_valid()
	 * @desc					Test if the storage engine is valid
	 * @return {boolean}		Is valid ?
	 */
	var cb_is_valid = function()
	{
		return false;
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.read_all_records()
	 * @desc					Read all records along storage strategy
	 * @return {object}			A promise
	 */
	var cb_read_all_records = function ()
	{
		var self = this;
		
		// USE CACHED QUERIES
		var query_key = 'all';
		if (self.use_cached_queries)
		{
			var query_promise = self.cached_queries[query_key];
			if (query_promise)
			{
				return query_promise;
			}
			
			var promise = self.read_all_records_self();
			promise.then(
				function(resultset)
				{
					self.cached_queries[query_key] = promise;
				}
			);
			
			return promise;
		}
		
		// DON'T USE CACHED QUERIES
		var result_promise = self.read_all_records_self();
		// console.log(result_promise);
		return result_promise;
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.read_all_records_self()
	 * @desc					Read all records along storage strategy
	 * @return {object}			A promise
	 */
	var cb_read_all_records_self = function ()
	{
		var self = this;
		return Devapt.promise_rejected(Devapt.msg_default_empty_implementation);
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.read_records(arg_query)
	 * @desc					Read records of the given query along storage strategy (async mode)
	 * @param {object}			arg_query		Read query
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_read_records = function (arg_query)
	{
		var self = this;
		
		// USE CACHED QUERIES
		var query_key = DevaptTypes.is_object(arg_query) ? arg_query.get_key() : null;
		if (self.use_cached_queries && query_key)
		{
			var query_promise = self.cached_queries[query_key];
			if (query_promise)
			{
				return query_promise;
			}
			
			var promise = self.read_records_self(arg_query);
			promise.then(
				function(resultset)
				{
					self.cached_queries[query_key] = promise;
				}
			);
			
			return promise;
		}
		
		// DON'T USE CACHED QUERIES
		var result_promise = self.read_records_self(arg_query);
		// console.log(result_promise);
		return result_promise;
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.read_records_self(arg_query)
	 * @desc					Read records of the given query along storage strategy (async mode)
	 * @param {object}			arg_query		Read query
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_read_records_self = function (arg_query)
	{
		var self = this;
		// console.log(arg_query, 'storage.read_records_self.arg_query');
		return Devapt.promise_rejected(Devapt.msg_default_empty_implementation);
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.create_records(arg_records)
	 * @desc					Create one or more records with the given values (async mode)
	 * @param {object|array}	arg_records		Records of values
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_create_records = function (arg_records)
	{
		var self = this;
		return Devapt.promise_rejected(Devapt.msg_default_empty_implementation);
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.update_records(arg_records)
	 * @desc					Update one or more records with the given values (async mode)
	 * @param {object|array}	arg_records		Records of values
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_update_records = function (arg_records)
	{
		var self = this;
		return Devapt.promise_rejected(Devapt.msg_default_empty_implementation);
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.delete_records(arg_records)
	 * @desc					Delete one or more records with the given values (async mode)
	 * @param {object|array}	arg_records		Records of values
	 * @return {object}			A promise of a ResultSet
	 */
	var cb_delete_records = function (arg_records)
	{
		var self = this;
		return Devapt.promise_rejected(Devapt.msg_default_empty_implementation);
	};
	
	
	/**
	 * @memberof				DevaptStorage
	 * @public
	 * @method					DevaptStorage.touch_cached_records(arg_records, arg_action)
	 * @desc					Update cached values with given records and action
	 * @param {object|array}	arg_records		Records of values
	 * @param {object|array}	arg_action		Action name
	 * @return {nothing}
	 */
	var cb_touch_cached_records = function (arg_records, arg_action)
	{
		var self = this;
		var context = 'touch_cached_records(records, action)';
		self.enter(context, '');
		
		
		self.cached_queries = {};
		
		
		self.leave(context, Devapt.msg_success_promise);
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-08-11',
			updated:'2015-02-02',
			description:'Storage engines base class.'
		}
	};
	var parent_class = DevaptObject;
	var DevaptStorageClass = new DevaptClass('DevaptStorage', parent_class, class_settings);
	
	// METHODS
	DevaptStorageClass.infos.ctor = cb_constructor;
	DevaptStorageClass.add_public_method('is_valid', {}, cb_is_valid);
	DevaptStorageClass.add_public_method('read_all_records', {}, cb_read_all_records);
	DevaptStorageClass.add_public_method('read_all_records_self', {}, cb_read_all_records_self);
	DevaptStorageClass.add_public_method('read_records', {}, cb_read_records);
	DevaptStorageClass.add_public_method('read_records_self', {}, cb_read_records_self);
	DevaptStorageClass.add_public_method('create_records', {}, cb_create_records);
	DevaptStorageClass.add_public_method('update_records', {}, cb_update_records);
	DevaptStorageClass.add_public_method('delete_records', {}, cb_delete_records);
	DevaptStorageClass.add_public_method('touch_cached_records', {}, cb_touch_cached_records);
	
	// MIXINS
	
	// PROPERTIES
	DevaptStorageClass.add_public_bool_property('use_cached_queries', 'should cache query results', false, false, false, []);
	DevaptStorageClass.add_public_obj_property('cached_queries', 'query results cache', {}, false, false, []);
	
	DevaptStorageClass.add_public_bool_property('is_storage', 'class instance is a storage engine', true, false, true, []);
	DevaptStorageClass.add_public_bool_property('is_sync', 'storage engine has synchronous operations', false, false, false, []);
	DevaptStorageClass.add_public_bool_property('is_cached', 'storage engine has cached operations', false, false, false, []);
	DevaptStorageClass.add_public_int_property('cache_ttl', 'storage engine cache TTL (time to leave)', null, false, false, []);
	DevaptStorageClass.add_public_bool_property('is_local_storage', 'storage engine has local datas on browser', true, false, false, []);
	DevaptStorageClass.add_public_bool_property('is_remote_storage', 'storage engine has remote datas on server', false, false, false, []);
	
	DevaptStorageClass.add_public_str_property('notify_create', 'notify user on create operations', true, false, false, []);
	DevaptStorageClass.add_public_str_property('notify_read', 'notify user on read operations', false, false, false, []);
	DevaptStorageClass.add_public_str_property('notify_update', 'notify user on update operations', true, false, false, []);
	DevaptStorageClass.add_public_str_property('notify_delete', 'notify user on delete operations', true, false, false, []);
	
	
	return DevaptStorageClass;
} );