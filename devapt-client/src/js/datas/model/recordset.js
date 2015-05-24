/**
 * @file        datas/model/recordset.js
 * @desc        Array of records on a model with a filtering query
 *              API:
 *                  ->constructor(object)     : nothing
 *  
 *                  ->get_records()   		  : array of Records objects
 *                  ->get_count()             : integer (records count)
 *  
 *                  ->new_record()            : 
 *                  ->free_record()           : 
 *                  
 *                  ->update_records_map()    : Reload all query model records
 *                  ->get_record_by_id(id)    : Lookup a record with its id
 *                  ->get_first_record_by_field(n,v): Lookup a record with a field name and a field value
 *                  ->get_first_record_by_object(o) : Lookup a record with its values
 *                  
 *                  ->load(datas)             : Fill the Recordset with given datas records
 *                  ->read()                  : Read records from the model with the owned query
 *                  ->read_all()              : Read all available records from the model
 *  
 *                  ->save()                  : Save all dirty records into the model
 *                  ->erase()                 : Remove all records and update the model
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-02-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define([
	'Devapt', 'core/types',
	'object/class', 'object/object', 'object/mixin-status',
	'datas/model/record', 'datas/query'],
function(Devapt, DevaptTypes,
	DevaptClass, DevaptObject, DevaptMixinStatus,
	DevaptRecord, DevaptQuery)
{
	/**
	 * @public
	 * @class				DevaptRecordSet
	 * @desc				Read only result set fot storage engines
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptRecordSet
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// DEBUG
//		self.trace=true;
		
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// INIT EMPTY RECORDS
		self.empty_records = [];
		
		// LOAD A RECORDSET
		if (self.recordset && self.resultset.is_recordset)
		{
			self.model = self.recordset.model;
			self.records = self.recordset.records;
			self.records_map = self.recordset.records_map;
			self.query = self.recordset.query.clone();
			self.id_field_name = self.recordset.id_field_name;
		}
		
		// LOAD A RESULTSET
		else if (self.resultset && self.resultset.is_resultset)
		{
			self.load(self.resultset);
		}
		
		// NOTHING TO LOAD
		else
		{
			self.status = 'empty';
			self.error = null;
		}
		
		// CHECK MODEL
		self.assert_object(context, 'model', self.model);
		
		// INIT QUERY
		if ( ! DevaptTypes.is_object(self.query) )
		{
			self.query = DevaptQuery.create(self.name + '_query', {});
			self.query.select_all();
		}
		
		// INIT STATUS
		if ( DevaptTypes.is_array(self.records) )
		{
			self.status = 'ok';
			self.error = null;
		}
		
		
		// CONSTRUCTOR END
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	/* --------------------------------------------- RECORD OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.get_records()
	 * @desc					Get all result records
	 * @return {array}
	 */
	var cb_get_records = function ()
	{
		var self = this;
		return self.records;
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.get_count()
	 * @desc					Get result records count
	 * @return {string}
	 */
	var cb_get_count = function ()
	{
		var self = this;
		return self.records.length;
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.get_empty_record()
	 * @desc					Get an empty Record object (create it or reuse it)
	 * @return {object}
	 */
	var cb_new_record = function ()
	{
		var self = this;
		
		if( self.empty_records.length > 0 )
		{
			return self.empty_records.pop();
		}
		
		return DevaptRecord.create(self.name + '_record_' + Devapt.uid(), { recordset:self });
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.free_record(record)
	 * @desc					Unuse a Record
	 * @param {object}			arg_record		uused Record object
	 * @return {object}			Promise of the operation
	 */
	var cb_free_record = function (arg_record)
	{
		var self = this;
		var context = 'free_record(record)';
		self.enter(context, '');
		self.assert_object(context, 'record', arg_record);
		
		var promise = arg_record.erase().then(
			function()
			{
				self.empty_records.push(arg_record);
			}
		);
		
		self.leave(context, '');
		return promise;
	};
	
	
	
	/* --------------------------------------------- LOOKUP OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					self.update_records_map()
	 * @desc					Fill the records map
	 * @return {nothing}	
	 */
	var cb_update_records_map = function ()
	{
		var self = this;
		var context = 'update_records_map()';
		self.enter(context, '');
		self.assert_object(context, 'model', self.model);
		self.assert_array(context, 'records', self.records);
		
		try
		{
			var pk_field = self.model.get_pk_field();
			self.assert_object(context, 'pk_field', pk_field);
			
			self.id_field_name = pk_field.name;
			self.records_map = {};
			
//			console.debug(self.records, 'self.records');
			for(var record_index in self.records)
			{
				var record = self.records[record_index];
				var record_id = record.get(self.id_field_name);
				
//				console.debug(record, 'record');
//				console.debug(self.id_field_name, 'self.id_field_name');
//				console.debug(record_id, 'record_id');
				
				self.records_map[record_id] = record;
			}
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		self.leave(context, '');
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					self.has_record()
	 * @desc					Test if a Record is part of this Recordset
	 * @param {object}			arg_record		a Record object
	 * @return {boolean}	
	 */
	var cb_has_record = function(arg_record)
	{
		var self = this;
		var context = 'has_record(record)';
		self.enter(context, '');
		self.assert_object(context, 'record is object', arg_record);
		self.assert_true(context, 'record.is_record', arg_record.is_record);
		self.assert_array(context, 'records', self.records);
		
		
		var found = false;
		try
		{
			if ( ! DevaptTypes.is_not_empty_object(self.records_map) )
			{
				self.update_records_map();
			}
			
			// GET RECORD ID
			var id = self.id_field_name in arg_record ? arg_record[self.id_field_name] : null;
			self.value(context, 'id_field_name', self.id_field_name);
			self.value(context, 'given record id', id);
			
			found = id && (id in arg_record) && (id in self.records_map);
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		self.leave(context, found ? Devapt.msg_found : Devapt.msg_not_found);
		return found;
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					self.get_record_by_id()
	 * @desc					Get a Record with its id
	 * @param {anything}		arg_field_value		lookup field value
	 * @return {object}			Found Record object or null if not found
	 */
	var cb_get_record_by_id = function(arg_field_value)
	{
		var self = this;
		var context = 'get_record_by_id(value)';
		self.enter(context, '');
		self.assert_not_empty_string(context, 'arg_field_value', arg_field_value);
		self.assert_object(context, 'model', self.model);
		self.assert_array(context, 'records_map', self.records_map);
		
		
		try
		{
			if ( ! DevaptTypes.is_not_empty_object(self.records_map) )
			{
				self.update_records_map();
			}
			
			if (arg_field_value in self.records_map)
			{
				self.leave(context, Devapt.msg_found);
				return self.records_map[arg_field_value];
			}
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		self.leave(context, Devapt.msg_not_found);
		return null;
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					self.get_first_record_by_field(field name, field value)
	 * @desc					Lookup the first Record corresponding to the field/value filter
	 * @param {string}			arg_field_name		lookup field name
	 * @param {anything}		arg_field_value		lookup field value
	 * @return {object}			Found Record object or null if not found
	 */
	var cb_get_first_record_by_field = function(arg_field_name, arg_field_value)
	{
		var self = this;
		var context = 'get_first_record_by_field(name,value)';
		self.enter(context, '');
		self.assert_not_empty_string(context, 'arg_field_name', arg_field_name);
		self.assert_object(context, 'model', self.model);
		self.assert_array(context, 'records', self.records);
		self.value(context, 'arg_field_name', arg_field_name);
		self.value(context, 'arg_field_value', arg_field_value);
		
		
		try
		{
			// FIELD NAME IS ID FIELD NAME
			if (arg_field_name === self.id_field_name)
			{
				var record = self.get_record_by_id(arg_field_value);
				
				self.leave(context, record ? Devapt.msg_found : Devapt.msg_not_found);
				return record;
			}
			
			// BAD FIELD NAME
			if (! self.model.get_field(arg_field_name) )
			{
				self.leave(context, Devapt.msg_not_found);
				return null;
			}
			
			// LOOP ON RECORDS
			for(var record_index in self.records)
			{
				var record = self.records[record_index];
				var record_value = record.get(arg_field_name);
				self.value(context, 'record', record);
				self.value(context, 'record_value', record_value);
				
				if (arg_field_value == record_value)
				{
					self.leave(context, Devapt.msg_found);
					return record;
				}
			}
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		self.leave(context, Devapt.msg_not_found);
		return null;
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					self.get_all_records_by_field(field name, field value, records)
	 * @desc					Lookup all Record corresponding to the field/value filter
	 * @param {string}			arg_field_name		lookup field name
	 * @param {anything}		arg_field_value		lookup field value
	 * @param {anything}		arg_records			lookup records list (optional, default: all recordset records)
	 * @return {array}			Array of all found Record object
	 */
	var cb_get_all_records_by_field = function(arg_field_name, arg_field_value, arg_records)
	{
		var self = this;
		var context = 'get_all_records_by_field(name,value,records)';
		self.enter(context, '');
		
		// CHECK ARGS
		self.assert_not_empty_string(context, 'arg_field_name', arg_field_name);
		self.assert_object(context, 'model', self.model);
		self.assert_array(context, 'records', self.records);
		self.value(context, 'arg_field_name', arg_field_name);
		self.value(context, 'arg_field_value', arg_field_value);
		arg_records = DevaptTypes.is_array(arg_records) ? arg_records : self.records;
		
		
		try
		{
			// FIELD NAME IS ID FIELD NAME
			if (arg_field_name === self.id_field_name)
			{
				self.step(context, 'FIELD NAME IS ID FIELD NAME');
				
				var record = self.get_record_by_id(arg_field_value);
				
				self.leave(context, record ? Devapt.msg_found : Devapt.msg_not_found);
				return record;
			}
			
			// BAD FIELD NAME
			if (! self.model.get_field(arg_field_name) )
			{
				self.step(context, 'FIELD NAME IS NOT FOUND IN MODEL FIELDS');
				
				self.leave(context, Devapt.msg_not_found);
				return [];
			}
			
			// LOOP ON RECORDS
			self.step(context, 'LOOP ON RECORDS');
			var found_records = [];
			for(var record_index in arg_records)
			{
				var record = arg_records[record_index];
				var record_value = record.get(arg_field_name);
				self.value(context, 'record.name', record.name);
				self.value(context, 'record.datas', record.datas);
				self.value(context, 'record[' + arg_field_name + '] value', record_value);
				
				if (arg_field_value == record_value)
				{
					self.value(context, 'found record', record);
					found_records.push(record);
				}
			}
			
			self.leave(context, found_records.length > 0 ? Devapt.msg_found :  Devapt.msg_not_found);
			return found_records;
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		self.leave(context, Devapt.msg_not_found);
		return [];
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					self.get_first_record_by_object(arg_object)
	 * @desc					Get a Record with its values
	 * @param {anything}		arg_field_value		lookup field value
	 * @return {object}			Found Record object or null if not found
	 */
	var cb_get_first_record_by_object = function(arg_object)
	{
		var self = this;
		var context = 'get_first_record_by_object(object)';
		self.enter(context, '');
		self.assert_object(context, 'arg_object', arg_object);
		self.assert_not_empty_string(context, 'id_field_name', self.id_field_name);
		self.assert_object(context, 'model', self.model);
		self.assert_array(context, 'records', self.records);
		
		
		// DEBUG
//		console.log(arg_object, context + ':arg_object');
		
		try
		{
			if (arg_object.is_record)
			{
				self.step(context, 'given object is a record');
				
				if ( self.has_record(arg_object) )
				{
					self.step(context, 'given object is found in recordset');
					
					self.leave(context, Devapt.msg_found);
					return arg_object;
				}
				
				self.step(context, 'given object is not found in recordset');
				arg_object = arg_object.datas;
			}
			
			if ( ! DevaptTypes.is_not_empty_object(self.records_map) )
			{
				self.update_records_map();
			}
			
			// GET RECORD ID
			var id = self.id_field_name in arg_object ? arg_object[self.id_field_name] : null;
			self.value(context, 'id_field_name', self.id_field_name);
			self.value(context, 'given record id', id);
			
			// LOOKUP ID IN RECORDS MAP
			if (id && id in self.records_map)
			{
				self.step(context, 'given object id is found in records map');
				
				self.leave(context, Devapt.msg_found);
				return self.records_map[id];
			}
			
			// LOOP ON OTHER FIELDS
			var fields = self.model.fields;
			var filters_count = Object.keys(arg_object).length;
			var found_records = self.records;
			for(var field_name in arg_object)
			{
				var value = arg_object[field_name];
				self.value(context, 'field_name', field_name);
				self.value(context, 'value', value);
				
				// SKIP CONTAINER INDEX INTERNAL ADDON
				if (field_name === 'container_item_index')
				{
					self.step(context, 'skip "container_item_index"');
					continue;
				}
				
				// VIEW ITERATOR IS 'FIELDS'
				if (field_name === 'field_name')
				{
					self.step(context, 'object is a field_name/field_value pair');
					
					field_name = arg_object.field_name;
					value = arg_object.field_value;
					
					self.value(context, 'field_name', field_name);
					self.value(context, 'value', value);
				}
				
//				console.debug({'field':field_name,'value':value}, context + ':field name/value');
				if ( self.model.has_field(field_name) )
				{
					self.step(context, 'model has field');
					
					found_records = self.get_all_records_by_field(field_name, value, found_records);
					if (found_records.length < 1)
					{
						self.step(context, 'model has field but no record found');
						
						self.leave(context, Devapt.msg_not_found);
						return null;
					}
				}
			}
			
			var found_record = found_records.length >= 1 ? found_records[0] : null;
			
			self.leave(context, found_record ? Devapt.msg_found : Devapt.msg_not_found);
			return found_record;
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		self.leave(context, Devapt.msg_not_found);
		return null;
	};
	
	
	
	/* --------------------------------------------- LOAD OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.load(datas)
	 * @desc					Fill the recordset with given datas
	 * @param {array|object}	arg_datas		datas to fill recordset (a ResultSet, an array of Records, an array of Plain objects)
	 * @return {object}			Promise of the operation
	 */
	var cb_load = function (arg_datas)
	{
		var self = this;
		var context = 'load()';
		self.enter(context, '');
		self.assert_not_null(context, 'datas', arg_datas);
		
		
		try
		{
			// INIT LOADING
			self.set_status('loading');
			self.records = [];
			self.records_map = {};
			
			// RESULTSET
			if ( DevaptTypes.is_object(arg_datas) && arg_datas.is_resultset )
			{
				self.step(context, 'set a Resultset');
				arg_datas = arg_datas.get_records();
			}
			
			// ARRAY OF ITEMS
			if ( DevaptTypes.is_array(arg_datas) )
			{
				self.step(context, 'process an array of datas');
				self.value(context, 'arg_datas', arg_datas);
				
				var items_promises = [];
				for(var item_key in arg_datas)
				{
					var item = arg_datas[item_key];
					var record = self.new_record();
					var promise = record.load(item);
					self.value(context, 'item for key[' + item_key + ']', item);
					
					self.records.push(record);
					items_promises.push(promise);
				}
				
				// FINISH LOADING
				var all_promise = Devapt.promise_all(items_promises);
				var promise = all_promise.then(
					function()
					{
						self.step(context, 'update records map');
						self.update_records_map();
						self.set_ok();
					}
				);
				
				promise = promise.then(
					function() { return self; }
				);
				
				self.leave(context, Devapt.msg_success_promise);
				return promise;
			}
			
			// FINISH LOADING
			self.set_error('bad datas');
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		self.leave(context, Devapt.msg_failure_promise);
		return Devapt.promise_rejected();
	};
	
	
	
	/* --------------------------------------------- READ OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.read()
	 * @desc					Read records from the model with the owned query
	 * @return {object}			Promise of the operation
	 */
	var cb_read = function ()
	{
		var self = this;
		var context = 'read()';
		self.assert_object(context, 'model', self.model);
		self.assert_object(context, 'query', self.query);
		
		try
		{
			self.set_status('reading');
			self.records = [];
			var promise = self.model.read(self.query, self);
			promise = promise.then(
				function()
				{
					return self;
				}
			);
			
			return promise;
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		return Devapt.promise_rejected();
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.read_all()
	 * @desc					Read all records from the model
	 * @return {object}			Promise of the operation
	 */
	var cb_read_all = function ()
	{
		var self = this;
		var context = 'read_all()';
		self.assert_object(context, 'model', self.model);
		self.assert_object(context, 'query', self.query);
		
		try
		{
			self.query.select_all();
			var promise = self.read();
			
			return promise;
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		return Devapt.promise_rejected();
	};
	
	
	
	/* --------------------------------------------- SAVE / ERASE OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.save()
	 * @desc					Save all dirty records into the model
	 * @return {object}			Promise of the operation
	 */
	var cb_save = function ()
	{
		var self = this;
		var context = 'save()';
		self.assert_object(context, 'model', self.model);
		self.assert_array(context, 'records', self.records);
		
		
		try
		{
			// LOOP ON RECORDS
			var dirty_records = [];
			var dirty_records_datas = [];
			for(var record_index in self.records)
			{
				var record = self.records[record_index];
				if (record.is_dirty)
				{
					dirty_records.push(record);
					dirty_records_datas.push(record.datas);
				}
			}
			
			
			// NO DIRTY RECORD TO SAVE
			if (dirty_records_datas.length === 0)
			{
				return Devapt.promise_resolved();
			}
			
			
			// SAVE DIRTY RECORDS
			// TODO LOCK UPDATE OF RECORDS DURING SAVING
			var promise = self.model.update(dirty_records_datas);
			promise = promise.then(
				function()
				{
					for(var record_index in dirty_records)
					{
						dirty_records[record_index].is_dirty = false;
					}
					
					return self;
				}
			);
			
			return promise;
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		return Devapt.promise_rejected();
	};
	
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.erase()
	 * @desc					Remove all records and update the model
	 * @return {object}			Promise of the operation
	 */
	var cb_erase = function ()
	{
		var self = this;
		var context = 'erase()';
		self.assert_object(context, 'model', self.model);
		self.assert_array(context, 'records', self.records);
		
		
		try
		{
			// LOOP ON RECORDS
			// TODO LOCK CHANGE ON RECORDSET
			var all_promises = [];
			for(var record_index in self.records)
			{
				var record = self.records[record_index];
				
				var erase_promise = record.erase();
				erase_promise.then(
					function()
					{
						self.free_record(record);
					}
				);
				
				all_promises.push(erase_promise);
			}
			
			
			return Devapt.promise_all(all_promises).then( function() { return self; } );
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		return Devapt.promise_rejected();
	};
	
	
	
	/* --------------------------------------------- APPEND / INSERT / REMOVE OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.append(datas)
	 * @desc					Create records into the model and append them to the recordset
	 * @param {object|array}	arg_datas			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_append = function (arg_datas)
	{
		var self = this;
		var context = 'append(datas)';
		self.assert_object(context, 'model', self.model);
		self.assert_not_empty_object_or_array(context, 'datas', arg_datas);
		
		
		try
		{
			// ONE RECORD
			if ( ! DevaptTypes.is_array(arg_datas) )
			{
				arg_datas = [ arg_datas ];
			}
			
			
			// CREATE NORMALIZED RECORDS
			var records = [];
			var records_datas = [];
			var items_promises = [];
			for(var item_key in arg_datas)
			{
				self.value(context, 'key', item_key);
				
				var item = arg_datas[item_key];
				var record = self.new_record();
				var promise = record.load(item);
				
				records.push(record);
				promise.then(
					function()
					{
						records_datas.push(record.datas);
					}
				);
				items_promises.push(promise);
			}
			var all_promise = Devapt.promise_all(items_promises);
			
			
			// MODEL AND RECORDSET OPERATIONS
			all_promise = all_promise.then(
				function()
				{
//					console.log(records_datas, context + ':records_datas');
					
					// CREATE IN MODEL
					var create_promise = self.model.create(records_datas);
					
					// APPEND INTO THE RECORDSET
					return create_promise.then(
						function(records)
						{
							// APPEND AN ARRAY OF RECORDS
							for(var record_index in records)
							{
								var record = records[record_index];
								self.records.push(record);
								
								var record_id = record[self.id_field_name];
								self.records_map[record_id] = record;
							}
							
							self.set_ok();
							
							return records;
						}
					);
				}
			);
			
			return all_promise;
//			return all_promise.then( function() { return self; } );
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		return Devapt.promise_rejected();
	};
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.insert(index, datas)
	 * @desc					Create records into the model and insert them to the recordset at the given index
	 * @param {integer}			arg_index			index to insert datas
	 * @param {object|array}	arg_datas			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
/*	var cb_insert = function (arg_index, arg_datas)
	{
		var self = this;
		var context = 'insert()';
		self.assert_object(context, 'model', self.model);
		self.assert_integer(context, 'index', arg_index);
		self.assert_not_empty_object_or_array(context, 'datas', arg_datas);
		
		
		try
		{
			// ONE RECORD
			if ( DevaptTypes.is_object(arg_datas) )
			{
				arg_records = [ arg_records ];
			}
			
			
			// CREATE NORMALIZED RECORDS
			var records = [];
			var records_datas = [];
			var items_promises = [];
			for(var item_key in arg_datas)
			{
				var item = arg_datas[item_key];
				var record = self.new_record();
				var promise = record.load(item);
				records.push(record);
				promise.then(
					function()
					{
						records_datas.push(record.datas);
					}
				);
				items_promises.push(promise);
			}
			var all_promise = Devapt.promise_all(items_promises);
			
			
			// MODEL AND RECORDSET OPERATIONS
			all_promise = all_promise.then(
				function()
				{
					// CREATE IN MODEL
					var create_promise = self.model.create(records_datas);
					
					// APPEND INTO THE RECORDSET
					return create_promise.then(
						function()
						{
							// APPEND AN ARRAY OF RECORDS
							for(var record_index in records)
							{
								var record = records[record_index];
								self.records.push(record);
								
								var record_id = record[self.id_field_name];
								self.records_map[record_id] = record;
							}
							
							self.set_ok();
						}
					);
				}
			);
			
			
			return all_promise.then( function() { return self; } );
		}
		catch(e)
		{
			self.error(context, e);
		}
		
		
		return Devapt.promise_rejected();
	};*/
	
	
	
	
	/**
	 * @memberof				DevaptRecordSet
	 * @public
	 * @method					DevaptRecordSet.remove(datas)
	 * @desc					Delete records into the model for the given datas (ids)
	 * @param {object|array}	arg_datas			one record object or an array of objects or an array of primary keys
	 * @return {object}			Promise of the operation
	 */
	// var cb_remove = function (arg_datas)
	// {
		// var self = this;
		// self.assert_object(context, 'model', self.model);
		// self.assert_not_empty_object_or_array(context, 'records', arg_records);
		
		// var promise = self.model.delete(arg_records);
		// promise.then(
			// function()
			// {
			// }
		// );
		
		// return promise;
	// };
	
	
	
	/* --------------------------------------------- QUERY OPERATIONS ------------------------------------------------ */
	
	/**
	 * @public
	 * @memberof				DevaptRecordSet
	 * @desc					Add a filter on a query with a field name/value pair.
	 * @param {string|object}	arg_field_name		field name or field object
	 * @param {string|number}	arg_field_value		field value
	 * @param {boolean}			arg_is_unique		filter should be unique on this field
	 * @return {nothing}
	 */
	var cb_add_field_value_filter = function(arg_field_name, arg_field_value, arg_is_unique)
	{
		var self = this;
		var context = 'add_field_value_filter(field,value,unique)';
		self.enter(context, arg_field_name);
		self.assert_not_empty_string(context, 'arg_field_name', arg_field_name);
		
		
		// CHECK ARGS
		var field_name = DevaptTypes.is_string(arg_field_name) ? arg_field_name : (DevaptTypes.is_object(arg_field_name) ? arg_field_name.name : null);
		self.assert_not_empty_string(context, 'field_name', field_name);
		var id = self.query.name + '.' + field_name + '.' + DevaptTypes.to_string(arg_field_value, 'nothing');
		var field_filter = { id: id, combination:'and', expression: {operator: 'equals', operands: [{ value:field_name, type:'string'}, { value:arg_field_value, type:'string'}]} };
		
		// DEBUG
		self.value(context, 'field_name', field_name);
		self.value(context, 'arg_field_value', arg_field_value);
		self.value(context, 'arg_is_unique', arg_is_unique);
		
		// ADD FILTER
		self.query.add_filter(field_name, field_filter, arg_is_unique);
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-02-02',
			description:'Read only result set fot storage engines'
		},
		mixins:[DevaptMixinStatus]
	};
	var parent_class = DevaptObject;
	var DevaptRecordSetClass = new DevaptClass('DevaptRecordSet', parent_class, class_settings);
	
	
	// METHODS
	DevaptRecordSetClass.infos.ctor = cb_constructor;
	
	DevaptRecordSetClass.add_public_method('get_records', {}, cb_get_records);
	DevaptRecordSetClass.add_public_method('get_count', {}, cb_get_count);
	
	DevaptRecordSetClass.add_public_method('new_record', {}, cb_new_record);
	DevaptRecordSetClass.add_public_method('free_record', {}, cb_free_record);
	
	DevaptRecordSetClass.add_public_method('update_records_map', {}, cb_update_records_map);
	DevaptRecordSetClass.add_public_method('has_record', {}, cb_has_record);
	
	DevaptRecordSetClass.add_public_method('get_record_by_id', {}, cb_get_record_by_id);
	DevaptRecordSetClass.add_public_method('get_first_record_by_field', {}, cb_get_first_record_by_field);
	DevaptRecordSetClass.add_public_method('get_all_records_by_field', {}, cb_get_all_records_by_field);
	DevaptRecordSetClass.add_public_method('get_first_record_by_object', {}, cb_get_first_record_by_object);
	
	DevaptRecordSetClass.add_public_method('load', {}, cb_load);
	DevaptRecordSetClass.add_public_method('read', {}, cb_read);
	DevaptRecordSetClass.add_public_method('read_all', {}, cb_read_all);
	
	DevaptRecordSetClass.add_public_method('save', {}, cb_save);
	DevaptRecordSetClass.add_public_method('erase', {}, cb_erase);
	
	DevaptRecordSetClass.add_public_method('append', {}, cb_append);
	// DevaptRecordSetClass.add_public_method('insert', {}, cb_insert);
	// DevaptRecordSetClass.add_public_method('remove', {}, cb_remove);
	
	DevaptRecordSetClass.add_public_method('add_field_value_filter', {}, cb_add_field_value_filter);
	
	
	// PROPERTIES
	DevaptRecordSetClass.add_public_bool_property('is_recordset', 'object is a Records object', true, false, true, []);
	
	DevaptRecordSetClass.add_public_str_property('id_field_name', 'records id field name', null, false, true, []);
	DevaptRecordSetClass.add_public_array_property('records', 'records array', [], false, false, [], 'object', '|');
	DevaptRecordSetClass.add_public_array_property('records_map', 'records map with record id as key', {}, false, false, [], 'object', '|');
	
	DevaptRecordSetClass.add_public_object_property('model', 'recordset model', null, false, false, []);
	DevaptRecordSetClass.add_public_object_property('resultset', 'resultset source', null, false, false, [], 'object', '|');
	
	
	return DevaptRecordSetClass;
} );