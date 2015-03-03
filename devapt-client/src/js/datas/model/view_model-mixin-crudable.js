/**
 * @file        datas/model/view_model-mixin-crudable.js
 * @desc        ModelView mixin class for CRUD operations
 * 				
 *              API:
 *                  ->constructor(object)     : nothing
 *  
 *                  ->reload()                : Reload records from the model and update the view
 *  
 *                  ->create(records)         : Create given records into the model and update the view
 *                  ->read()                  : Get records from the model with the query
 *                  ->read_all()              : Get all records from the model
 *                  ->update(records)         : Update given records into the model and update the view
 *                  ->delete(records)         : Delete given records into the model and update the view
 *  
 *                  ->get_items_types_array() : get container view items types (html, view, text...)
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
	'datas/model/shared_recordset'],
function(
	Devapt, DevaptTypes,
	DevaptClass, DevaptObject,
	DevaptSharedRecordSet)
{
	/**
	 * @public
	 * @class				DevaptViewModelMixinCrudable
	 * @desc				ModelView mixin class for CRUD operations
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptViewModelMixinCrudable
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		var context = 'constructor';
		self.enter(context, '');
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	/* --------------------------------------------- CRUD OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					DevaptViewModelMixinCrudable.reload()
	 * @desc					Reload records from the model and refresh the view
	 * @return {object}			Promise of the operation
	 */
	var cb_reload = function ()
	{
		var self = this;
		self.enter('reload()', '');
		// self.assert_object(context, 'recordset', self.recordset);
		self.assert_object(context, 'query', self.query);
		
		var promise = self.ready_promise.then(
			function()
			{
				return self.model.read(self.query);
			}
		);
		
		promise.then(
			function(recordset)
			{
				self.step('reload()', 'read success');
				self.recordset = recordset;
				self.view.on_view_model_reload();
			}
		);
		
		self.leave('reload()', Devapt.msg_success_promise);
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					DevaptViewModelMixinCrudable.create(records)
	 * @desc					Create records into the model
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_create = function (arg_records)
	{
		var self = this;
		self.enter('create()', '');
		// self.assert_object(context, 'recordset', self.recordset);
		self.assert_object(context, 'query', self.query);
		self.assert_not_empty_object_or_array(context, 'arg_records', arg_records);
		
		var promise = self.ready_promise.then(
			function()
			{
				return self.model.create(arg_records);
			}
		);
		
		promise.then(
			function()
			{
				self.step('create()', 'create success');
				self.view.on_view_model_create(arg_records);
			}
		);
		
		self.leave('create()', Devapt.msg_success_promise);
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					DevaptViewModelMixinCrudable.read()
	 * @desc					Read records from the model with the query
	 * @return {object}			Promise of the operation
	 */
	var cb_read = function ()
	{
		var self = this;
		self.enter('read()', '');
		
		
		// ON READY
		var promise = self.ready_promise.then(
			function()
			{
				self.step('read()', 'view_model is ready');
				self.value('read()', 'items_iterator', self.view.items_iterator);
				
				// CHECK ATTRIBUTES
				// self.assert_object(context, 'model', self.model); // TODO
				// self.assert_object(context, 'query', self.query); // TODO
				
				switch(self.view.items_iterator)
				{
					case 'records': return self.get_items_array_model_with_iterator_records(); //return self.model.read(self.query);
					case 'fields': return self.get_items_array_model_with_iterator_fields();
					case 'field_editor': return self.get_items_array_model_with_iterator_field_editor();
					default: return Devapt.promise_rejected('bad view iterator [' + self.view.items_iterator + ']');
				}
			}
		);
		
		// console.log(promise, 'read()');
		promise.then(
			function(recordset)
			{
				self.step('read()', 'read success');
				// console.log(recordset, self.name + '.' + 'read()' + '.recordset');
				self.recordset = recordset;
				
				if ( DevaptTypes.is_function(self.on_view_model_read) )
				{
					self.view.on_view_model_read(recordset.records);
				}
			}
		);
		
		
		self.leave('read()', Devapt.msg_success_promise);
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					DevaptViewModelMixinCrudable.read_all()
	 * @desc					Read all records from the model
	 * @return {object}			Promise of the operation
	 */
	var cb_read_all = function ()
	{
		var self = this;
		self.enter('read_all()', '');
		var context = 'read_all()';
		// self.assert_object(context, 'recordset', self.recordset);
		
		var promise = self.ready_promise.then(
			function()
			{
				return self.model.read_all();
			}
		);
		
		promise.then(
			function(recordset)
			{
				self.step('read_all()', 'read_all success');
				self.recordset = recordset;
				self.view.on_view_model_read_all(recordset.records);
			}
		);
		
		self.leave('read_all()', Devapt.msg_success_promise);
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					DevaptViewModelMixinCrudable.update()
	 * @desc					Update records into the model
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_update = function (arg_records)
	{
		var self = this;
		self.enter('update()', '');
		self.assert_object(context, 'recordset', self.recordset);
		self.assert_not_empty_object_or_array(context, 'arg_records', arg_records);
		
		var promise = self.ready_promise.then(
			function()
			{
				return self.model.update(arg_records);
			}
		);
		
		promise.then(
			function()
			{
				self.step('update()', 'update success');
				self.view.on_view_model_update(arg_records);
			}
		);
		
		self.leave('update()', Devapt.msg_success_promise);
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModelMixinCrudable
	 * @public
	 * @method					DevaptViewModelMixinCrudable.delete()
	 * @desc					Delete records into the model
	 * @param {object|array}	arg_records			one record object or an array of objects or an array of primary keys
	 * @return {object}			Promise of the operation
	 */
	var cb_delete = function (arg_records)
	{
		var self = this;
		self.enter('delete()', '');
		// self.assert_object(context, 'recordset', self.recordset);
		self.assert_not_empty_object_or_array(context, 'arg_records', arg_records);
		
		var promise = self.ready_promise.then(
			function()
			{
				return self.model.delete(arg_records);
			}
		);
		
		promise.then(
			function(recordset)
			{
				self.step('delete()', 'delete success');
				self.view.on_view_model_delete(arg_records);
			}
		);
		
		self.leave('delete()', Devapt.msg_success_promise);
		return promise;
	};
	
	
	
	/* --------------------------------------------- UTILS OPERATIONS ------------------------------------------------ */
	
	/**
	 * @public
	 * @memberof			DevaptViewModelMixinCrudable
	 * @desc				Get items array for field iterator
	 * @return {promise}
	 */
	var cb_get_items_array_model_with_iterator_fields = function()
	{
		var self = this;
		var context = 'get_items_array_model_with_iterator_fields()';
		self.enter(context, '');
		
		
		// CHECK ATTRIBUTES
		self.assert_not_null(context, 'model', self.model);
		self.assert_not_null(context, 'view', self.view);
		
		// INIT ITEMS
		var items = [];
		
		// GET CURRENT RECORD
		var record = self.view.items_current_record;
		if ( DevaptTypes.is_object(record) )
		{
			self.step(context, 'current record is found');
			
			// LOOP ON FIELDS
			for(var field_index in self.view.items_fields)
			{
				self.value(context, 'loop on field at', field_index);
				
				var field_name = self.view.items_fields[field_index];
				var field_value = record[field_name];
				var field_record = { 'field_name': field_name, 'field_value': field_value };
				
				items.push(field_record);
			}
			
			self.value(context, 'items', items);
		}
		
		// CREATE RESULTSET
		var unique_name = Devapt.get_unique_name(self.name + '_recordset');
		var recordset = DevaptSharedRecordSet.create(unique_name, { records:items, count:items.length});
		
		
		self.leave(context, Devapt.msg_success_promise);
		return Devapt.promise_resolved(recordset);
	};
	
	
	
	/**
	 * @public
	 * @memberof			DevaptViewModelMixinCrudable
	 * @desc				Get items array for records iterator
	 * @return {promise}
	 */
	var cb_get_items_array_model_with_iterator_records = function()
	{
		var self = this;
		var context = 'get_items_array_model_with_iterator_records()';
		self.enter(context, '');
		
		
		// CHECK ATTRIBUTES
		self.assert_not_null(context, 'model', self.model);
		self.assert_not_null(context, 'view', self.view);
		
		
		// READ ALL
		if ( ! DevaptTypes.is_object(self.query) || self.query.is_empty() )
		{
			self.step(context, 'read_all_records');
			return self.model.read_all();
		}
		
		// READ DISTINCT
		if (self.view.items_distinct)
		{
			self.step(context, 'read distinct records');
			if ( DevaptTypes.is_not_empty_str(self.view.items_distinct_field) )
			{
				self.step(context, 'read distinct one records');
				
				self.query.set_select_distinct_one();
				self.query.set_one_field(self.view.items_distinct_field);
			}
			else
			{
				self.step(context, 'read distinct many records');
				
				self.query.set_select_distinc();
			}
		}
		
		// READ WITH A QUERY
		var items_promise = self.model.read(self.query);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return items_promise;
	};
	
	
	
	/**
	 * @public
	 * @memberof			DevaptViewModelMixinCrudable
	 * @desc				Get items array for records iterator
	 * @return {promise}
	 */
	var cb_get_items_array_model_with_iterator_field_editor = function()
	{
		var self = this;
		var context = 'get_items_array_model_with_iterator_field_editor()';
		self.enter(context, '');
		
		
		// CHECK ATTRIBUTES
		self.assert_not_null(context, 'model', self.model);
		self.assert_not_null(context, 'view', self.view);
		
		
		// GET FIELD NAME
		var field_name = self.view.items_fields[0];
		if ( ! DevaptTypes.is_not_empty_str(field_name) )
		{
			console.error('bad field name', context);
			throw new Error(context + ':bad field name');
		}
		
		
		// GET FIELD OBJECT
		var field_obj = self.model.get_field(field_name);
		if ( ! DevaptTypes.is_object(field_obj) )
		{
			console.error('bad field object', context);
			throw new Error(context + ':bad field object');
		}
		
		
		// GET FIELD ATTRIBUTES
		var type_str = DevaptTypes.to_string(field_obj.field_value.type, 'string').toLocaleLowerCase();
		var name_str = DevaptTypes.to_string(field_obj.name, null);
		var label_str = DevaptTypes.to_string(field_obj.label, null);
		self.value(context, 'type_str', type_str);
		self.value(context, 'name_str', name_str);
		self.value(context, 'label_str', label_str);
		
		
		// GET FIELD VALUES
		var items_promise = field_obj.get_available_values();
		
		
		self.leave(context, Devapt.msg_success_promise);
		return items_promise;
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
	
	DevaptViewModelMixinCrudableClass.add_public_method('create', {}, cb_create);
	DevaptViewModelMixinCrudableClass.add_public_method('read', {}, cb_read);
	DevaptViewModelMixinCrudableClass.add_public_method('read_all', {}, cb_read_all);
	DevaptViewModelMixinCrudableClass.add_public_method('update', {}, cb_update);
	DevaptViewModelMixinCrudableClass.add_public_method('delete', {}, cb_delete);
	
	DevaptViewModelMixinCrudableClass.add_public_method('get_items_array_model_with_iterator_fields', {}, cb_get_items_array_model_with_iterator_fields);
	DevaptViewModelMixinCrudableClass.add_public_method('get_items_array_model_with_iterator_records', {}, cb_get_items_array_model_with_iterator_records);
	DevaptViewModelMixinCrudableClass.add_public_method('get_items_array_model_with_iterator_field_editor', {}, cb_get_items_array_model_with_iterator_field_editor);
	
	// MIXINS
	
	// PROPERTIES
	
	
	return DevaptViewModelMixinCrudableClass;
} );