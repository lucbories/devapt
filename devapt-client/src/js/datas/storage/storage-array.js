/**
 * @file        datas/storage/storage-array.js
 * @desc        Devapt ARRAY storage engine
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
	 * @class				DevaptArrayStorage
	 * @desc				ARRAY storage engine class
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptArrayStorage
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
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.is_valid()
	 * @desc					Test if the storage engine is valid
	 * @return {boolean}		Is valid ?
	 */
	var cb_is_valid = function()
	{
		return DevaptTypes.is_array(self.records_array);
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.read_all_records()
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptArrayStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						records_array = [{name:'a', age=5},{name:'b', age=15},{name:'c', age=25}]
	 * 					};
	 * 					var store = new DevaptArrayStorage('store', store_opts);
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
		
		
		// FILTERED DATAS
		var filtered_datas = self.records_array;
		// console.log(filtered_datas, 'filtered_datas');
		
		// NOTIFY
		if (self.notify_read)
		{
			Devapt.get_current_backend().notify_info('storage json: read all is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_read_all', {status:'ok', records:filtered_datas, count:filtered_datas.length});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
		self.leave(context, self.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.read_records(arg_query)
	 * @desc					Read records of the given query along storage strategy (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptArrayStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						records_array = [{name:'a', age=5},{name:'b', age=15},{name:'c', age=25}]
	 * 					};
	 * 					var store = new DevaptArrayStorage('store', store_opts);
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
		
		
		// FILTERED DATAS
		var filtered_datas = self.records_array; // TODO USE query to filter array datas
		// console.log(filtered_datas, self.name + '.' + context + '.filtered_datas');
		
		// NOTIFY
		if (self.notify_read)
		{
			Devapt.get_current_backend().notify_info('storage json: read query is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_read_' + arg_query.name, {status:'ok', records:filtered_datas, count:filtered_datas.length});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
		self.leave(context, self.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.create_records(arg_records)
	 * @desc					Create one or more records with the given values (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptArrayStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						records_array = [{name:'a', age=5},{name:'b', age=15},{name:'c', age=25}]
	 * 					};
	 * 					var record = {"id_user":null,"login":"jcarter","lastname":"CARTER","firstname":"Jimmy","email":"jcarter@usa.us","password":"mypass"};
	 * 					var store = new DevaptArrayStorage('store', store_opts);
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
		
		
		// CREATE RECORDS
		if ( DevaptTypes.is_object(arg_records) )
		{
			arg_records = [arg_records];
		}
		if ( DevaptTypes.is_array(arg_records) )
		{
			for(var record_index in arg_records)
			{
				var record = arg_records[record_index];
				if ( DevaptTypes.is_object(record) )
				{
					self.records_array.push(record);
				}
			}
		}
		
		// NOTIFY
		if (self.notify_create)
		{
			Devapt.get_current_backend().notify_info('storage json: create is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_create', {status:'ok', records:[], count:0});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
		self.leave(context, self.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.update_records(arg_records)
	 * @desc					Update one or more records with the given values (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptArrayStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						records_array = [{name:'a', age=5},{name:'b', age=15},{name:'c', age=25}]
	 * 					};
	 * 					var store = new DevaptArrayStorage('store', store_opts);
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
		
		
		// UPDATE DATAS
		var filtered_datas = self.records_array; // TODO USE query to filter array datas
		// console.log(filtered_datas, 'filtered_datas');
		// TODO UDPATE DATAS
		
		// NOTIFY
		if (self.notify_update)
		{
			Devapt.get_current_backend().notify_info('storage json: update is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_update', {status:'ok', records:[], count:0});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
		self.leave(context, self.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.delete_records(arg_records)
	 * @desc					Delete one or more records with the given values (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-json'],
	 * 				function(DevaptArrayStorage)
	 * 				{
	 * 					var store_opts = {
	 * 						url_read:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_create:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_update:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/',
	 * 						url_delete:'/devapt-tutorial-1/public/rest/MODEL_AUTH_USERS/'
	 * 					};
	 * 					var store = new DevaptArrayStorage('store', store_opts);
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
		var context = 'delete_records(records)';
		self.enter(context, '');
		
		
		// DELETE DATAS
		var filtered_datas = self.records_array; // TODO USE query to filter array datas
		// console.log(filtered_datas, 'filtered_datas');
		// TODO DELETE DATAS
		
		// NOTIFY
		if (self.notify_delete)
		{
			Devapt.get_current_backend().notify_info('storage json: delete is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_delete', {status:'ok', records:[], count:0});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
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
			description:'ARRAY storage engine.'
		},
		properties:{
		}
	};
	var parent_class = DevaptStorage;
	var DevaptStorageClass = new DevaptClass('DevaptArrayStorage', parent_class, class_settings);
	
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
	DevaptStorageClass.add_public_array_property('records_array', 'records array', [], false, false, [], 'object', '|');
	
	
	return DevaptStorageClass;
} );