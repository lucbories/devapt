/**
 * @file        datas/model/view_model.js
 * @desc        ModelView class to interact with a model and a view and to deal with functional rules7
 * 				
 * 				Principle:
 * 					... <--[Datas]--> Storage Engine <--[ResultSet]--> Model
 * 					Model <--[SharedRecordSet]--> ViewModel <--[datas]--> View
 * 				
 * 				Example:
 * 					A view V receive a refresh event.
 * 					V call its ViewModel VM reload operation.
 * 					VM call its Model M read() operation.
 * 					Model call its storage engine SE read() operation.
 * 					M receives a ResultSet from SE.
 * 					VM receives a SharedRecordSet R2 from M.
 * 					VM replace its previous SharedRecordSet R1 by R2 (if R1<>R2).
 * 					VM call refresh operation on V with R2 (if R1<>R2).
 * 				
 *              API:
 *                  ->constructor(object)     : nothing
 *  
 *                  ->get_status()            : string
 *                  ->get_error()             : string
 *                  ->is_valid()              : boolean (query, model, view, records are valid object and status is 'ok')
 *                  ->is_ok()                 : boolean (status is 'ok')
 *                  ->is_error()              : boolean (status is 'error')
 *  
 *                  ->get_records()           : Current SharedRecordSet object (shared between many ViewModel instances)
 *                  ->get_query()             : Query object (one Query per View)
 *                  ->get_model()             : Model object (shared between many ViewModel instances)
 *                  ->get_view()              : View object (one ViewModel per View)
 *  
 *                  ->reload()                : Reload all query model records and refresh the view
 *  
 *                  ->create(records)         : Create given records into the model and update the view
 *                  ->read()                  : Get records from the model with the query
 *                  ->read_all()              : Get all records from the model
 *                  ->update(records)         : Update given records into the model and update the view
 *                  ->delete(records)         : Delete given records into the model and update the view
 *  
 *                  ->select(records)         : Given records are selected into the View object
 *                  ->select_all()            : All view records are selected into the View object
 *                  ->unselect(records)       : Given records are unselected into the View object
 *                  ->unselect_all()          : All view records are unselected into the View object
 *  
 * @ingroup     DEVAPT_DATAS
 * @date        2015-02-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(['Devapt', 'core/types', 'core/resources',
'object/class', 'object/object',
'datas/model/model', 'datas/query', 'datas/model/shared_recordset',
'views/view'],
function(Devapt, DevaptTypes, DevaptResources,
DevaptClass, DevaptObject,
DevaptModel, DevaptQuery, DevaptSharedRecordSet,
DevaptView)
{
	/**
	 * @public
	 * @class				DevaptViewModel
	 * @desc				Read only result set fot storage engines
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptViewModel
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// DEBUG
		self.trace=true;
		
		// SET QUERY
		if ( ! Devapt.is_object(self.query) || ! self.query.is_query )
		{
			self.step(context, 'set query');
			var query_name = self.name + '_query';
			self.query = DevaptQuery.create(query_name, {});
		}
		
		// SET MODEL
		if ( ! Devapt.is_object(self.model) || ! self.query.is_model )
		{
			self.step(context, 'set model');
			if ( ! Devapt.is_string(self.model) )
			{
				self.error(context, 'bad model name');
				return;
			}
			var model_promise = DevaptResources.get_resource_instance(self.model);
			model_promise.then(
				function(model)
				{
					self.step(context, 'model is found');
					self.model = model;
				},
				function()
				{
					self.error(context, 'bad model resource');
				}
			);
		}
		
		// SET VIEW
		if ( ! Devapt.is_object(self.view) || ! self.query.is_view )
		{
			self.step(context, 'set view');
			if ( ! Devapt.is_string(self.view) )
			{
				self.error(context, 'bad view name');
				return;
			}
			var view_promise = DevaptResources.get_resource_instance(self.view);
			view_promise.then(
				function(view)
				{
					self.step(context, 'view is found');
					self.view = view;
				},
				function()
				{
					self.error(context, 'bad view resource');
				}
			);
		}
		
		// SET RECORDS
		if ( Devapt.is_object(self.records) && self.query.is_records )
		{
			self.step(context, 'records is set');
		}
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.is_valid()
	 * @desc					Test if the storage engine is valid
	 * @return {boolean}		Is valid ?
	 */
	var cb_is_valid = function()
	{
		var self = this;
		self.step('is valid ?', '');
		
		return self.is_ok()
			&& Devapt.is_object(self.model) && self.model.is_model
			&& Devapt.is_object(self.query) && self.query.is_query
			&& Devapt.is_object(self.view) && self.view.is_view
			&& Devapt.is_object(self.records) && self.records.is_records;
	};
	
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.get_records()
	 * @desc					Get all records object
	 * @return {object}			Records object
	 */
	var cb_get_records = function ()
	{
		var self = this;
		self.step('get records', '');
		return self.records;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.get_query()
	 * @desc					Get the view query
	 * @return {object}			Query object
	 */
	var cb_get_query = function ()
	{
		var self = this;
		self.step('get query', '');
		return self.query;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.get_model()
	 * @desc					Get the model
	 * @return {object}			Model object
	 */
	var cb_get_model = function ()
	{
		var self = this;
		self.step('get model', '');
		return self.model;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.get_view()
	 * @desc					Get the view
	 * @return {object}			View object
	 */
	var cb_get_view = function ()
	{
		var self = this;
		self.step('get view', '');
		return self.view;
	};
	
	
	
	/* --------------------------------------------- CRUD OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.reload()
	 * @desc					Reload records from the model and refresh the view
	 * @return {object}			Promise of the operation
	 */
	var cb_reload = function ()
	{
		var self = this;
		self.enter('reload()', '');
		self.assert_object(context, 'records', self.records);
		self.assert_object(context, 'query', self.query);
		
		var promise = self.model.read(self.query);
		promise.then(
			function()
			{
				self.step('reload()', 'read success');
				self.view.on_view_model_reload();
			}
		);
		
		self.leave('reload()', 'promise');
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.create(records)
	 * @desc					Create records into the model
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_create = function (arg_records)
	{
		var self = this;
		self.enter('create()', '');
		self.assert_object(context, 'records', self.records);
		self.assert_object(context, 'query', self.query);
		self.assert_not_empty_object_or_array(context, 'arg_records', arg_records);
		
		var promise = self.model.create(arg_records);
		promise.then(
			function()
			{
				self.step('create()', 'create success');
				self.view.on_view_model_create(arg_records);
			}
		);
		
		self.leave('create()', 'promise');
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.read()
	 * @desc					Read records from the model with the query
	 * @return {object}			Promise of the operation
	 */
	var cb_read = function ()
	{
		var self = this;
		self.enter('read()', '');
		self.assert_object(context, 'records', self.records);
		self.assert_object(context, 'query', self.query);
		
		var promise = self.model.read(self.query);
		promise.then(
			function(recordset)
			{
				self.step('read()', 'read success');
				self.view.on_view_model_read(recordset.records);
			}
		);
		
		self.leave('read()', 'promise');
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.read_all()
	 * @desc					Read all records from the model
	 * @return {object}			Promise of the operation
	 */
	var cb_read_all = function ()
	{
		var self = this;
		self.enter('read_all()', '');
		var context = 'read_all()';
		self.assert_object(context, 'records', self.records);
		
		var promise = self.model.read_all();
		promise.then(
			function(recordset)
			{
				self.step('read_all()', 'read_all success');
				self.view.on_view_model_read_all(recordset.records);
			}
		);
		
		self.leave('read_all()', 'promise');
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.update()
	 * @desc					Update records into the model
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_update = function (arg_records)
	{
		var self = this;
		self.enter('update()', '');
		self.assert_object(context, 'records', self.records);
		self.assert_not_empty_object_or_array(context, 'arg_records', arg_records);
		
		var promise = self.model.update(arg_records);
		promise.then(
			function()
			{
				self.step('update()', 'update success');
				self.view.on_view_model_update(arg_records);
			}
		);
		
		self.leave('update()', 'promise');
		return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.delete()
	 * @desc					Delete records into the model
	 * @param {object|array}	arg_records			one record object or an array of objects or an array of primary keys
	 * @return {object}			Promise of the operation
	 */
	var cb_delete = function (arg_records)
	{
		var self = this;
		self.enter('delete()', '');
		self.assert_object(context, 'records', self.records);
		self.assert_not_empty_object_or_array(context, 'arg_records', arg_records);
		
		var promise = self.model.delete(arg_records);
		promise.then(
			function()
			{
				self.step('delete()', 'delete success');
				self.view.on_view_model_delete(arg_records);
			}
		);
		
		self.leave('delete()', 'promise');
		return promise;
	};
	
	
	
	/* --------------------------------------------- SELECT OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.select(records)
	 * @desc					Select one or more records into the view
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_select = function (arg_records)
	{
		var self = this;
		self.enter('select()', '');
		self.assert_object(context, 'model', self.model);
		
		// var promise = model.read(self.query);
		
		self.leave('select()', '');
		// return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.select_all(records)
	 * @desc					Select all records into the view
	 * @return {object}			Promise of the operation
	 */
	var cb_select_all = function ()
	{
		var self = this;
		self.enter('select_all()', '');
		self.assert_object(context, 'model', self.model);
		
		// var promise = model.read(self.query);
		
		self.leave('select_all()', '');
		// return promise;
	};
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.unselect(records)
	 * @desc					Unselect one or more records into the view
	 * @param {object|array}	arg_records			one record object or an array of objects
	 * @return {object}			Promise of the operation
	 */
	var cb_unselect = function (arg_records)
	{
		var self = this;
		self.enter('unselect()', '');
		self.assert_object(context, 'model', self.model);
		
		// var promise = model.read(self.query);
		
		self.leave('unselect()', '');
		// return promise;
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.unselect_all(records)
	 * @desc					Unelect all records into the view
	 * @return {object}			Promise of the operation
	 */
	var cb_unselect_all = function ()
	{
		var self = this;
		self.enter('unselect_all()', '');
		self.assert_object(context, 'model', self.model);
		
		// var promise = model.read(self.query);
		
		self.leave('unselect_all()', '');
		// return promise;
	};
		
		
		
	/**
	 * @public
	 * @memberof				DevaptViewModel
	 * @desc					Add a filter on a query with a field name/value pair.
	 * @param {string}			arg_query_name		query name
	 * @param {string|object}	arg_field_name		field name or field object
	 * @param {string|number}	arg_field_value		field value
	 * @param {boolean}			arg_is_unique		filter should be unique on this field
	 * @return {boolean}
	 */
	var cb_add_field_value_filter = function(arg_field_name, arg_field_value, arg_is_unique)
	{
		var self = this;
		var context = 'add_field_value_filter()';
		self.enter(context, '');
		
		
		// DEBUG
		self.value(context, 'arg_query_name', arg_query_name);
		self.value(context, 'arg_field_name', arg_field_name);
		self.value(context, 'arg_field_value', arg_field_value);
		self.value(context, 'arg_is_unique', arg_is_unique);
		
		// CHECK ARGS
		var id = self.query.name + '.' + arg_field_name + '.' + arg_field_value;
		var field_name = DevaptTypes.is_string(arg_field_name) ? arg_field_name : (DevaptTypes.is_object(arg_field_name) ? arg_field_name.name : null);
		self.assert_not_empty_string(context, 'field_name', field_name);
		var field_filter = { id: id, combination:'and', expression: {operator: 'equals', operands: [{ value:field_name, type:'string'}, { value:arg_field_value, type:'string'}]} };
		
		// ADD FILTER
		self.query.add_filter(field_name, field_filter, arg_is_unique);
		
		// EMIT EVENTS
		// self.fire_event('devapt.query.updated');
		// self.fire_event('devapt.query.filters.added', [field_filter]);
		
		
		self.leave(context, '');
		return true;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-02-02',
			description:'Business rules between model and view.'
		}
	};
	var parent_class = DevaptObject;
	var DevaptViewModelClass = new DevaptClass('DevaptViewModel', parent_class, class_settings);
	
	// METHODS
	DevaptViewModelClass.infos.ctor = cb_constructor;
	
	// DevaptViewModelClass.add_public_method('get_status', {}, cb_get_status);
	// DevaptViewModelClass.add_public_method('get_error', {}, cb_get_error);
	
	DevaptViewModelClass.add_public_method('is_valid', {}, cb_is_valid);
	// DevaptViewModelClass.add_public_method('is_ok', {}, cb_is_ok);
	// DevaptViewModelClass.add_public_method('is_error', {}, cb_is_error);
	
	DevaptViewModelClass.add_public_method('get_records', {}, cb_get_records);
	DevaptViewModelClass.add_public_method('get_model', {}, cb_get_model);
	DevaptViewModelClass.add_public_method('get_query', {}, cb_get_query);
	DevaptViewModelClass.add_public_method('get_view', {}, cb_get_view);
	
	DevaptViewModelClass.add_public_method('reload', {}, cb_reload);
	
	DevaptViewModelClass.add_public_method('create', {}, cb_create);
	DevaptViewModelClass.add_public_method('read', {}, cb_read);
	DevaptViewModelClass.add_public_method('read_all', {}, cb_read_all);
	DevaptViewModelClass.add_public_method('update', {}, cb_update);
	DevaptViewModelClass.add_public_method('delete', {}, cb_delete);
	
	DevaptViewModelClass.add_public_method('select', {}, cb_select);
	DevaptViewModelClass.add_public_method('select_all', {}, cb_select_all);
	DevaptViewModelClass.add_public_method('unselect', {}, cb_unselect);
	DevaptViewModelClass.add_public_method('unselect_all', {}, cb_unselect_all);
	
	DevaptViewModelClass.add_public_method('add_field_value_filter', {}, cb_add_field_value_filter);
	
	// MIXINS
	
	// PROPERTIES
	DevaptViewModelClass.add_public_bool_property('is_view_model', 'object is a ViewModel', true, false, true, []);
	// DevaptViewModelClass.add_public_str_property('status', 'operation status', null, true, true, []);
	// DevaptViewModelClass.add_public_str_property('error', 'error message for failed operation', null, true, true, []);
	
	DevaptViewModelClass.add_public_object_property('query', 'View query object for the model', null, false, false, []);
	DevaptViewModelClass.add_public_object_property('view', 'View object linked with the model', null, true, false, []);
	DevaptViewModelClass.add_public_object_property('model', 'Model object linked with the view', null, true, false, []);
	DevaptViewModelClass.add_public_object_property('records', 'Model datas result for the query', null, true, false, []);
	
	
	return DevaptViewModelClass;
} );