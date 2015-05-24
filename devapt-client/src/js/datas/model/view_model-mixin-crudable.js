/**
 * @file        datas/model/view_model-mixin-crudable.js
 * @desc        ModelView mixin class for CRUD operations
 * 				
 *              API:
 *                  ->constructor(object)     : nothing
 *  
 *                  ->reload()                : Reload records from the model and update the view
 *                  ->get_values()            : Get values
 *  
 *                  ->create(records)         : Create given records into the model and update the view
 *                  ->read()                  : Get records from the model with the query
 *                  ->read_all()              : Get all records from the model
 *                  ->update(records)         : Update given records into the model and update the view
 *                  ->delete(records)         : Delete given records into the model and update the view
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
	'object/class', 'object/object',
	'datas/model/recordset'],
function(
	Devapt, DevaptTypes,
	DevaptClass, DevaptObject,
	DevaptRecordSet)
{
	/**
	 * @public
	 * @class				DevaptViewModelMixinCrudable
	 * @desc				ModelView mixin class for CRUD operations
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptViewModelMixinCrudable
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		var context = 'DevaptViewModelMixinCrudable.constructor';
		self.enter(context, '');
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	/* --------------------------------------------- LOAD OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					self.reload()
	 * @desc					Reload records from the model recordset and refresh the view
	 * @return {object}			Promise of the operation
	 */
	var cb_reload = function ()
	{
		var self = this;
		var context = 'reload()';
		self.enter(context, '');
		self.assert_object(context, 'ready_promise', self.ready_promise);
		
		
		// LOAD DATAS
		var promise = self.ready_promise.spread(
			function(arg_model, arg_view)
			{
				var datas_promise = self.recordset.read();
				self.assert_object(context, 'datas_promise', datas_promise);
				
				datas_promise.then(
					function(recordset)
					{
						self.assert_object(context, 'recordset', recordset);
						
						// UPDATE THE VIEW
						self.ready_promise.spread(
							function(arg_model, arg_view)
							{
								self.step(context, 'read success');
								if (arg_view.on_view_model_reload)
								{
									arg_view.on_view_model_reload();
								}
							}
						);
					}
				);
				return datas_promise;
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					self.get_values_recordset()
	 * @desc					Get datas values RecordSet promise
	 * @return {promise}		A promise of a RecordSet
	 */
	var cb_get_values_recordset = function ()
	{
		var self = this;
		var context = 'get_values_recordset()';
		self.enter(context, '');
		
		
		var promise = self.ready_promise.spread(
			function(arg_model, arg_view)
			{
				var items = [];
				self.assert_not_empty_string(context, 'arg_view.items_iterator', arg_view.items_iterator);
				
				switch(arg_view.items_iterator)
				{
					case 'records':
					{
						return Devapt.promise_resolved(self.get_recordset());
					}
					
					case 'fields':
					{
						return Devapt.promise_resolved(self.get_recordset());
					}
					
					case 'field_editor':
					{
						self.assert_not_empty_array(context, 'arg_view.items_fields', arg_view.items_fields);
						
						var field_name = arg_view.items_fields[0];
						self.assert_not_empty_string(context, 'field_name', field_name);
						
						var field_obj = self.recordset.model.get_field(field_name);
						self.assert_object(context, 'field_obj', field_obj);
						
						self.edited_field = field_obj;
						
						// GET FIELD VALUES
						return field_obj.get_available_values(true);
					}
				}
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					self.get_values()
	 * @desc					Get datas values array promise
	 * @return {promise}		A promise of an array of values (Record or object)
	 */
	var cb_get_values = function ()
	{
		var self = this;
		var context = 'get_values()';
		self.enter(context, '');
		
		
		var promise = self.ready_promise.spread(
			function(arg_model, arg_view)
			{
				var items = [];
				self.assert_not_empty_string(context, 'arg_view.items_iterator', arg_view.items_iterator);
				
				switch(arg_view.items_iterator)
				{
					case 'records':
					{
						items = self.get_recordset().get_records();
						// self.value(context, 'items', items);
						return Devapt.promise_resolved(items);
					}
					
					case 'fields':
					{
						// GET FIRST RECORD
						var records = self.get_recordset().get_records();
						var record = records.length > 0 ? records[0] : null;
						if ( DevaptTypes.is_object(record) )
						{
							self.step(context, 'current record is found');
							
							self.value(context, 'arg_view.items_fields', arg_view.items_fields);
							items = record.get_fields_values(arg_view.items_fields);
							self.value(context, 'items', items);
						}
						return Devapt.promise_resolved(items);
					}
					
					case 'field_editor':
					{
						self.assert_not_empty_array(context, 'arg_view.items_fields', arg_view.items_fields);
						
						var field_name = arg_view.items_fields[0];
						self.assert_not_empty_string(context, 'field_name', field_name);
						
						var field_obj = self.recordset.model.get_field(field_name);
						self.assert_object(context, 'field_obj', field_obj);
						
						self.edited_field = field_obj;
						
						// GET FIELD VALUES
						var items_promise = field_obj.get_available_values(true);
						items_promise = items_promise.then(
							function(arg_recordset)
							{
								var records = arg_recordset.get_records();
								// self.value(context, 'records', records);
								
								return records;
							}
						);
						
						self.leave(context, Devapt.msg_success_promise);
						return items_promise;
					}
				}
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					self.get_first_record_by_object()
	 * @desc					Lookup a record with a datas values object
	 * @param {object}			arg_item_object		datas values object
	 * @return {promise}		A promise of Record
	 */
	var cb_get_first_record_by_object = function (arg_item_object)
	{
		var self = this;
		var context = 'get_first_record_by_object(item)';
		self.enter(context, '');
		
		
		var promise = self.ready_promise.spread(
			function(arg_model, arg_view)
			{
				self.step(context, 'view_model is ready');
				self.assert_not_empty_string(context, 'arg_view.items_iterator', arg_view.items_iterator);
				
				switch(arg_view.items_iterator)
				{
					case 'records':
					{
						self.step(context, 'view_model iterator is records');
						
						var record = self.get_recordset().get_first_record_by_object(arg_item_object);
						self.value(context, 'record', record);
						
						return Devapt.promise_resolved(record);
					}
					
					case 'fields':
					{
						self.step(context, 'view_model iterator is fields');
						
						// GET FIRST RECORD
						var records = self.get_recordset().get_records();
						var record = records.length > 0 ? records[0] : null;
						
						return Devapt.promise_resolved(record);
					}
					
					case 'field_editor':
					{
						self.step(context, 'view_model iterator is field_editor');
						self.assert_not_empty_array(context, 'arg_view.items_fields', arg_view.items_fields);
						
						var field_name = arg_view.items_fields[0];
						self.assert_not_empty_string(context, 'field_name', field_name);
						
						var field_obj = self.recordset.model.get_field(field_name);
						self.assert_object(context, 'field_obj', field_obj);
						
						self.edited_field = field_obj;
						
						// GET FIELD VALUES
						var record_promise = field_obj.get_available_values(true);
						record_promise = record_promise.then(
							function(arg_recordset)
							{
								var record = arg_recordset.get_first_record_by_object(arg_item_object);
								self.value(context, 'record', record);
								
								return record;
							}
						);
						
						self.leave(context, Devapt.msg_success_promise);
						return record_promise;
					}
				}
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-02-08',
			description:'Mixin for CRUD operation on a model view.'
		}
	};
	var parent_class = null;
	var DevaptViewModelMixinCrudableClass = new DevaptClass('DevaptViewModelMixinCrudable', parent_class, class_settings);
	
	// METHODS
	DevaptViewModelMixinCrudableClass.infos.ctor = cb_constructor;
	
	DevaptViewModelMixinCrudableClass.add_public_method('reload', {}, cb_reload);
	
	DevaptViewModelMixinCrudableClass.add_public_method('get_values', {}, cb_get_values);
	DevaptViewModelMixinCrudableClass.add_public_method('get_values_recordset', {}, cb_get_values_recordset);
	
	DevaptViewModelMixinCrudableClass.add_public_method('get_first_record_by_object', {}, cb_get_first_record_by_object);
	
	// MIXINS
	
	// PROPERTIES
	
	
	return DevaptViewModelMixinCrudableClass;
} );