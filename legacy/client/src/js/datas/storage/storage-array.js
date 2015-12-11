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
		
		
		// CALL SUPER CLASS CONSTRUCTOR
		self._parent_class.infos.ctor(self);
		self.is_remote_storage = false;
		self.is_local_storage = true;
		
		
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
		return DevaptTypes.is_array(self.records_array) || ( DevaptTypes.is_object(self.provider) && self.provider.is_provider );
	};
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.get_array()
	 * @desc					Get storage array
	 * @return {array}
	 */
	var cb_get_array = function()
	{
		var self = this;
		var context = 'get_array()';
		self.enter(context, '');
		
		
		// DEBUG
		// self.value(context, 'self.records_array', self.records_array);
		// self.value(context, 'self.provider', self.provider);
		// console.log(self.records_array, context);
		// console.log(self.provider, context);
		
		// PROVIDER
		if ( DevaptTypes.is_object(self.provider) && self.provider.is_provider )
		{
			self.leave(context, 'has an provider');
			return self.provider.get_records();
		}
		
		// OWNED RECORDS ARRAY
		if ( DevaptTypes.is_array(self.records_array) )
		{
			self.leave(context, 'has locale array');
			return self.records_array;
		}
		
		
		self.leave(context, 'default empty array');
		return [];
	};
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.set_item(item,index)
	 * @desc					Add or set storage array item
	 * @param {anything}		arg_item
	 * @param {integer}			arg_index (optional)
	 * @return {array}
	 */
	var cb_set_item = function(arg_item, arg_index)
	{
		var self = this;
		var context = 'set_item()';
		self.enter(context, '');
		
		
		// DEBUG
		// self.value(context, 'self.records_array', self.records_array);
		// self.value(context, 'self.provider_cb', self.provider_cb);
		
		
		// PROVIDER
		if ( DevaptTypes.is_null(arg_index) && DevaptTypes.is_object(self.provider) && self.provider.is_provider )
		{
			self.provider.add(arg_item);
			
			self.leave(context, 'add with a provider');
			return self.provider.get_records();
		}
		if ( DevaptTypes.is_integer(arg_index) && arg_index > 0 && DevaptTypes.is_object(self.provider) && self.provider.is_provider )
		{
			self.provider.set(arg_index, arg_item);
			
			self.leave(context, 'set with a provider');
			return self.provider.get_records();
		}

		// OWNED RECORDS ARRAY
		if ( DevaptTypes.is_array(self.records_array) )
		{
			self.step(context, 'has locale array');
			
			// APPEND
			if ( DevaptTypes.is_null(arg_index) )
			{
				self.records_array.push(arg_item);
				
				self.leave(context, 'add with a owned array');
				return self.records_array;
			}
			
			// UPDATE
			if ( DevaptTypes.is_integer(arg_index) && arg_index > 0 && arg_index < self.records_array.length)
			{
				self.records_array[arg_index] = arg_item;
				
				self.leave(context, 'set with a owned array');
				return self.records_array;
			}
			
			return null;
		}
		
		
		self.leave(context, 'default null array');
		return null;
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.read_all_records()
	 * 
	 * 		USE:
	 * 			require(['datas/storage-array'],
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
		
		
		// GET DATAS ARRAY
		var datas = self.get_array();
		self.value(context, 'datas', datas);
		
		// FILTERED DATAS
		var filtered_datas = datas;
		console.log(filtered_datas, context + ':filtered_datas');
		
		// NOTIFY
		if (self.notify_read)
		{
			Devapt.get_current_backend().notify_info('storage array: read all is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_read_all', {status:'ok', records:filtered_datas, count:filtered_datas.length});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.read_records(arg_query)
	 * @desc					Read records of the given query along storage strategy (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-array'],
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
		
		
		// DEBUG
		// self.value(context, 'self.records_array', self.records_array);
		// self.value(context, 'self.provider_cb', self.provider_cb);
		
		
		// FILTERED DATAS
		var filtered_datas = []; // TODO USE query to filter array datas
		// console.log(filtered_datas, self.name + '.' + context + '.filtered_datas');
		
		
		// SLICE ARRAY
		if (arg_query && arg_query.slice && arg_query.slice.offset > 0 )
		{
			self.step(context, 'has slice filter');
			
			// PROVIDER
			if ( DevaptTypes.is_object(self.provider) && self.provider.is_provider )
			{
				self.leave(context, 'has a provider');
				filtered_datas = self.provider.get_records(arg_query.slice.offset, arg_query.slice.length);
			}
			
			// OWNED RECORDS ARRAY
			else
			{
				self.step(context, 'apply valid slice filter');
				
				filtered_datas = self.get_array();
				if ( arg_query.slice.offset < datas.length )
				{
					// console.log(datas, self.name + '.' + context + '.records_array');
					filtered_datas = Array.prototype.slice.call(filtered_datas, arg_query.slice.offset);
					// console.log(filtered_datas, self.name + '.' + context + '.filtered_datas with slice');
				}
				console.log(arg_query.slice.offset, context + '.arg_query');
				console.log(filtered_datas.length, self.name + '.' + context + '.filtered_datas with slice');
			}
		}
		else
		{
			filtered_datas = self.get_array();
		}
		
		
		// NOTIFY
		if (self.notify_read)
		{
			Devapt.get_current_backend().notify_info('storage array: read query is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_read_' + arg_query.name, {status:'ok', records:filtered_datas, count:filtered_datas.length});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.create_records(arg_records)
	 * @desc					Create one or more records with the given values (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-array'],
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
		
		
		// GET DATAS ARRAY
		var datas = self.get_array();
		
		
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
					self.set_item(record, undefined);
				}
			}
		}
		
		// NOTIFY
		if (self.notify_create)
		{
			Devapt.get_current_backend().notify_info('storage array: create is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_create', {status:'ok', records:[], count:0});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.update_records(arg_records)
	 * @desc					Update one or more records with the given values (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-array'],
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
		
		
		// GET DATAS ARRAY
		var datas = self.get_array();
		
		// UPDATE DATAS
		var filtered_datas = datas; // TODO USE query to filter array datas
		// console.log(filtered_datas, 'filtered_datas');
		// TODO UDPATE DATAS
		
		// NOTIFY
		if (self.notify_update)
		{
			Devapt.get_current_backend().notify_info('storage array: update is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_update', {status:'ok', records:[], count:0});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return resultset_promise;
	};
	
	
	
	/**
	 * @memberof				DevaptArrayStorage
	 * @public
	 * @method					DevaptArrayStorage.delete_records(arg_records)
	 * @desc					Delete one or more records with the given values (async mode)
	 * 
	 * 		USE:
	 * 			require(['datas/storage-array'],
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
		
		
		// GET DATAS ARRAY
		var datas = self.get_array();
		
		// DELETE DATAS
		var filtered_datas = datas; // TODO USE query to filter array datas
		// console.log(filtered_datas, 'filtered_datas');
		// TODO DELETE DATAS
		
		// NOTIFY
		if (self.notify_delete)
		{
			Devapt.get_current_backend().notify_info('storage array: delete is done for [' + self.name + ']');
		}
		
		// RETURN A RESULT SET
		var resultset = DevaptResultSet.create(self.name + '_result_delete', {status:'ok', records:[], count:0});
		var resultset_promise = Devapt.promise_resolved(resultset);
		
		
		self.leave(context, Devapt.msg_success_promise);
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
	DevaptStorageClass.add_public_method('get_array', {}, cb_get_array);
	DevaptStorageClass.add_public_method('set_item', {}, cb_set_item);
	DevaptStorageClass.add_public_method('read_all_records_self', {}, cb_read_all_records_self);
	DevaptStorageClass.add_public_method('read_records_self', {}, cb_read_records_self);
	DevaptStorageClass.add_public_method('create_records', {}, cb_create_records);
	DevaptStorageClass.add_public_method('update_records', {}, cb_update_records);
	DevaptStorageClass.add_public_method('delete_records', {}, cb_delete_records);
	
	// MIXINS
	
	// PROPERTIES
	DevaptStorageClass.add_public_str_property('source', '', [], false, false, []);
	DevaptStorageClass.add_public_object_property('provider', '', null, false, false, []);
	DevaptStorageClass.add_public_array_property('records_array', 'records array', [], false, false, [], 'object', '|');
	
		// COLLECTION OPERATIONS
	// DevaptStorageClass.add_public_cb_property('get_records', '', null, false, false, []);
	// DevaptStorageClass.add_public_cb_property('set_records', '', null, false, false, []);
	// DevaptStorageClass.add_public_cb_property('remove_records', '', null, false, false, []);
		// ITEM OPERATIONS
	// DevaptStorageClass.add_public_cb_property('filter_record', '', null, false, false, []);
	// DevaptStorageClass.add_public_cb_property('get_record', '', null, false, false, []);
	// DevaptStorageClass.add_public_cb_property('set_record', '', null, false, false, []);
	// DevaptStorageClass.add_public_cb_property('remove_record', '', null, false, false, []);
	// DevaptStorageClass.add_public_cb_property('add_record', '', null, false, false, []);
		// READ/WRITE OPERATIONS
	// DevaptStorageClass.add_public_cb_property('encode', '', null, false, false, []);
	// DevaptStorageClass.add_public_cb_property('decode', '', null, false, false, []);
	
	
	return DevaptStorageClass;
} );