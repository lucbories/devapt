/**
 * @file        datas/model/view_model.js
 * @desc        ModelView class to interact with a model and a view and to deal with functional rules
 * 				
 * 				Principle:
 * 					... <--[Datas]--> Storage Engine <--[ResultSet]--> Model
 * 					Model <--[RecordSet]--> ViewModel <--[RecordSet]--> View
 * 				
 * 					A ViewModel contains the common state of a View and a Model.
 * 						A View.
 * 						Current datas records: a datas Recordset.
 * 						Current selected records: a selection Recordset.
 * 						Formulas, aliases, rules.
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
 *                  ->get_recordset()         : Current SharedRecordSet object (shared between many ViewModel instances)
 *                 // ->get_query()             : Query object (one Query per View)
 *                 // ->get_model()             : Model object (shared between many ViewModel instances)
 *                 // ->get_view()              : View object (one ViewModel per View)
 *  
 *                  ->reload()                : Reload all query model records and refresh the view
 *  
 *                  ->create(records)         : Create given records into the model and update the view
 *                  ->read()                  : Get records from the model with the query
 *                  ->read_all()              : Get all records from the model
 *                  ->update(records)         : Update given records into the model and update the view
 *                  ->delete(records)         : Delete given records into the model and update the view
 *  				
 *                  ->select_record(record)         : 
 *                  ->unselect_record(record)         : 
 *  				->get_selected_records()       :
 *  				->set_selected_records(records):
 *  				->get_selected_record(record)  :
 *  				->on_container_select(items)   :
 *  				
 *                  ->select_all()            : All view records are selected into the View object
 *                  ->unselect(records)       : Given records are unselected into the View object
 *                  ->unselect_all()          : All view records are unselected into the View object
 *  
 *                  ->get_items_types()       : get container view items types (html, view, text...)
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
	'Devapt', 'core/types', 'core/resources',
	'object/class', 'object/object',
	'datas/model/model', 'datas/datasource/datasources', 'datas/query', 'datas/model/recordset', 'datas/model/view_model-mixin-crudable', 'datas/model/view_model-mixin-selectable',
	'views/view'],
function(
	Devapt, DevaptTypes, DevaptResources,
	DevaptClass, DevaptObject,
	DevaptModel, DevaptDatasources, DevaptQuery, DevaptRecordSet, DevaptViewModelMixinCrudable, DevaptViewModelMixinSelectable,
	DevaptView)
{
	/**
	 * @public
	 * @class				DevaptViewModel
	 * @desc				ModelView class to interact with a model and a view and to deal with functional rules
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptViewModel
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// DEBUG
//		self.trace=true;
		
		// CONSTRUCTOR BEGIN
		var context = 'constructor';
		self.enter(context, '');
		
		
		// INIT PROMISES
		self.model_promise = null;
		self.view_promise = null;
		self.ready_promise = null;
		self.batch_promise = Devapt.promise_resolved();
		
		// INIT THE MODEL
		cb_init_model(self);
		
		// INIT THE VIEW
		cb_init_view(self);
		
		// INIT READY PROMISE
		self.assert_object(context, 'model_promise', self.model_promise);
		self.assert_object(context, 'view_promise', self.view_promise);
		self.ready_promise = Devapt.promise_all([self.model_promise, self.view_promise]);
		
		// INIT THE RECORDSET
		cb_init_recordset(self);
		
		// INIT ITEMS TYPES
		cb_init_items_types(self);
		
		// INIT FIELDS TYPES
		cb_init_fields_types(self);
		
		// INIT THE SELECTED RECORDS
		cb_init_selection(self);
		
		
		// CONSTRUCTOR END
		self.leave(context, Devapt.msg_success);
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
		
		var result = self.is_ok()
			&& DevaptTypes.is_object(self.ready_promise) && Devapt.is_promise(self.ready_promise)
			&& DevaptTypes.is_object(self.model_promise) && Devapt.is_promise(self.model_promise)
			&& DevaptTypes.is_object(self.view_promise) && Devapt.is_promise(self.view_promise)
			&& DevaptTypes.is_object(self.recordset) && self.recordset.is_recordset
			;
		self.value('is valid ?', 'result', result);
		return result;
	};
	
	
	
	/* --------------------------------------------- INIT OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					cb_init_model()
	 * @desc					Init a promise for a Model
	 * @return {nothing}
	 */
	var cb_init_model = function (self)
	{
		var context = 'cb_init_model';
		self.enter(context, '');
		
		
		try
		{
			if ( ! DevaptTypes.is_object(self.model) || ! self.model.is_model )
			{
				self.step(context, 'set model');
				
				self.value(context, 'source', self.source);
				switch(self.source)
				{
					case 'model':
					{
						self.step(context, 'source is model');
						
						if ( ! DevaptTypes.is_string(self.model_name) )
						{
							console.log(self.model_name, 'self.model_name');
							self.error(context, 'bad model name');
							return;
						}
						
						self.model_promise = DevaptResources.get_resource_instance(self.model_name);
						
						break;
					}
					
					case 'inline':
					{
						self.step(context, 'source is inline datas');
						// console.log(self.view.items_inline, self.name + '.' + context + '.view.items_inline');
						
						var items = [];
						if ( self.source_format === 'json' )
						{
							self.step(context, 'inline source format is json');
							
							var json_str = self.view.items_inline.join(',');
							var json_obj = $.parseJSON(json_str);
							
							items = json_obj;
						}
						else if ( self.source_format === 'array' )
						{
							self.step(context, 'inline source format is array');
							
							items = [];
							for(var item_index in self.view.items_inline)
							{
								var item_obj = self.view.items_inline[item_index];
								if ( ! DevaptTypes.is_object(item_obj) )
								{
									item_obj = { value: item_obj };
								}
								
								items.push(item_obj);
							}
							// console.log(items, self.name + '.' + context + '.items');
						}
						else
						{
							self.error(context, 'bad inline source format');
							return;
						}
						
						var engine_settings = {
							name:self.name + '_engine',
							records_array:items
						};
						
						var engine_promise = Devapt.create('StorageArray', engine_settings);
						self.assert_object(context, 'engine_promise', engine_promise);
						
						self.model_promise = engine_promise.then(
							function(engine_obj)
							{
								self.step(context, 'array engine is created');
								
								var model_settings = {
									name: self.name + '_model',
									engine:engine_obj,
									fields:{
										value:{
											type:'String',
											label:'Inline value',
											is_pk:true
										}
									}
								};
								
								return Devapt.create('Model', model_settings);
							}
						);
						
						break;
					}
				}
				
				
				// GET THE MODEL FROM DATASOURCES
				if ( ! self.model_promise)
				{
					self.model_promise = DevaptDatasources.get_datasource_model(self.source);
				}
			}
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		self.leave(context, '');
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					cb_init_view(self)
	 * @desc					Init a promise for a View
	 * @return {nothing}
	 */
	var cb_init_view = function (self)
	{
		var context = 'cb_init_view';
		self.enter(context, '');
		
		
		try
		{
			// GET VIEW
			var has_valid_view = DevaptTypes.is_object(self.view) && self.view.is_view;
			if ( ! has_valid_view)
			{
				self.step(context, 'set view');
				
				self.assert_not_empty_str(context, 'view name', self.view);
				
				self.view_promise = DevaptResources.get_resource_instance(self.view);
				self.view_promise.then(
					function(arg_view)
					{
						self.view_items_iterator = self.view.items_iterator;
					}
				);
			}
			else
			{
				self.step(context, 'view is set');
				self.view_promise = Devapt.promise_resolved(self.view);
				self.view_items_iterator = self.view.items_iterator;
			}
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		self.leave(context, '');
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					cb_init_selection()
	 * @desc					Init the selected records
	 * @return {nothing}
	 */
	var cb_init_selection = function (self)
	{
		var context = 'cb_init_selection';
		self.enter(context, '');
		
		
		try
		{
			// TODO
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		self.leave(context, '');
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					cb_init_recordset()
	 * @desc					Init the records set
	 * @return {nothing}
	 */
	var cb_init_recordset = function (self)
	{
		var context = 'cb_init_recordset';
		self.enter(context, '');
		
		
		try
		{
			var has_valid_recordset = DevaptTypes.is_object(self.recordset) && self.recordset.is_recordset;
			if ( ! has_valid_recordset)
			{
				self.step(context, 'init recordset');
				
				self.ready_promise = self.ready_promise.spread(
					function(arg_model, arg_view)
					{
						// CREATE ITEMS RECORDSET
						var recordset_name = self.name + '_recordset';
						var recordset_settings = {
							model:arg_model
						};
						
						self.recordset = DevaptRecordSet.create(recordset_name, recordset_settings);
						
						// GET PK FIELD NAME
						var pk_field = arg_model.get_pk_field();
						var pk_field_name = pk_field ? pk_field.name : null;
						
						// SET FIELDS LIST
						var pk_field_found = false;
						self.recordset.query.fields = [];
						for(var index in arg_view.items_fields)
						{
							var field_name = arg_view.items_fields[index];
							self.recordset.query.fields.push(field_name);
							
							if (pk_field_name && field_name === pk_field_name)
							{
								pk_field_found = true;
							}
						}
						
						// ADD ID FIELD IF NEEDED
						self.recordset.query.fields
						if (!pk_field_found)
						{
							self.recordset.query.fields.push(pk_field_name);
						}
						
						// SELECT DISTINCT CASE
						if (arg_view.items_distinct)
						{
							self.step(context, 'read distinct records');
							if ( DevaptTypes.is_not_empty_str(arg_view.items_distinct_field) )
							{
								self.step(context, 'read distinct one records');
								
								self.recordset.query.set_select_distinct_one();
								self.recordset.query.set_one_field(arg_view.items_distinct_field);
							}
							else
							{
								self.step(context, 'read distinct many records');
								
								self.recordset.query.set_select_distinc();
							}
						}
						else
						{
							self.step(context, 'set select query');
							self.recordset.query.set_select();
						}
						
						return [arg_model, arg_view];
					}
				);
			}
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		self.leave(context, '');
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					cb_init_items_types()
	 * @desc					Init the records set
	 * @return {nothing}
	 */
	var cb_init_items_types = function (self)
	{
		var context = 'cb_init_items_types';
		self.enter(context, '');
		
		
		try
		{
			self.ready_promise = self.ready_promise.spread(
				function(arg_model, arg_view)
				{
					self.step(context, 'init items types');
					
					self.items_types = [];
					
					// GET ITEMS TYPES FROM INLINE SOURCE
					if (self.source === 'inline')
					{
						self.step(context, 'inline source');
						
						if ( DevaptTypes.is_not_empty_array(arg_view.items_types) )
						{
							self.items_types = arg_view.items_types;
						}
					}
					
					// GET ITEMS TYPES FROM MODEL SOURCE
					else if (self.source === 'model')
					{
						self.step(context, 'model source');
						
						if (arg_view.items_iterator === 'field_editor' || arg_view.items_iterator === 'records' || arg_view.items_iterator === 'fields')
						{
							self.step(context, 'iterator is ' + arg_view.items_iterator);
							
							self.items_types = ['object'];
						}
					}
					
					return [arg_model, arg_view];
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		self.leave(context, '');
	};
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					cb_init_fields_types()
	 * @desc					Init the records set
	 * @return {nothing}
	 */
	var cb_init_fields_types = function (self)
	{
		var context = 'cb_init_fields_types';
		self.enter(context, '');
		
		
		try
		{
			self.ready_promise = self.ready_promise.spread(
				function(arg_model, arg_view)
				{
					self.step(context, 'init fields types');
					
					self.fields_types = [];
					
					// ITERATE ON ONE FIELD RECORDS
					if (arg_view.items_iterator === 'field_editor')
					{
						self.step(context, 'iterator is field_editor');
						
						self.fields_types = ['object'];
					}
					
					// ITERATE ON RECORDS
					else if (arg_view.items_iterator === 'records')
					{
						self.step(context, 'iterator is records');
						
						self.fields_types = arg_model.get_fields_types(arg_view.items_fields);
					}
					
					// ITERATE ON FIELDS
					else if (arg_view.items_iterator === 'fields')
					{
						self.step(context, 'iterator is fields');
						
						// FIELD NAME / FIELD VALUE
						self.fields_types = ['string', 'anything'];
					}
					
					else 
					{
						self.step(context, 'iterator is unknow');
					}
					
					return [arg_model, arg_view];
				}
			);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		self.leave(context, '');
	};
	
	
	
	/* --------------------------------------------- RECORDSET OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					self.get_recordset()
	 * @desc					Get recordset object
	 * @return {object}			RecordSet object
	 */
	var cb_get_recordset = function ()
	{
		var self = this;
		self.step('get recordset', '');
		
		return self.recordset;
	};
	
	
	
	/* --------------------------------------------- LINK OPERATIONS ------------------------------------------------ */
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					self.get_linked_record()
	 * @desc					Get linked record object
	 * @return {object}			Record object
	 */
	var cb_get_linked_record = function ()
	{
		var self = this;
		self.step('get linked record', '');
		return self.linked_record;
	};
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					self.set_linked_record(record)
	 * @desc					Set linked record object
	 * @param					arg_record		linked record
	 * @return {nothing}
	 */
	var cb_set_linked_record = function (arg_record)
	{
		var self = this;
		var context = 'set_linked_record(record)';
		self.enter(context, '');
		self.assert_object(context, 'record', arg_record);
		self.assert_true(context, 'record.is_record', arg_record.is_record);
		
		self.linked_record = arg_record;
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	
	/* --------------------------------------------- TYPES OPERATIONS ------------------------------------------------ */
	
	/**
	 * @public
	 * @memberof			DevaptViewModel
	 * @method				DevaptViewModel.get_items_types()
	 * @desc				Get container items types array with type in 'view', 'text', 'object'
	 * @return {array}
	 */
	var cb_get_items_types = function()
	{
		var self = this;
		var context = 'get_items_types()';
		self.enter(context, '');
		
		self.value(context, 'types', self.items_types);
		
		self.leave(context, Devapt.msg_success);
		return self.items_types;
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptViewModel
	 * @method				DevaptViewModel.get_fields_types()
	 * @desc				Get record fields types array with type in 'string', 'integer', 'object'...
	 * @return {array}
	 */
	var cb_get_fields_types = function()
	{
		var self = this;
		var context = 'get_fields_types()';
		self.enter(context, '');
		self.value(context, 'types', self.fields_types);
		
		
		self.leave(context, Devapt.msg_success);
		return self.fields_types;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-05-02',
			description:'Link between model and view.'
		},
		mixins: [DevaptViewModelMixinCrudable, DevaptViewModelMixinSelectable]
	};
	var parent_class = DevaptObject;
	var DevaptViewModelClass = new DevaptClass('DevaptViewModel', parent_class, class_settings);
	
	
	// METHODS
	DevaptViewModelClass.infos.ctor = cb_constructor;
	DevaptViewModelClass.add_public_method('is_valid', {}, cb_is_valid);
	
		// RECORDSET OPERATIONS
	DevaptViewModelClass.add_public_method('get_recordset', {}, cb_get_recordset);
//	DevaptViewModelClass.add_public_method('get_selection_recordset', {}, cb_get_selection_recordset);
	
		// LINK OPERATIONS
	DevaptViewModelClass.add_public_method('get_linked_record', {}, cb_get_linked_record);
	DevaptViewModelClass.add_public_method('set_linked_record', {}, cb_set_linked_record);
	
		// TYPES OPERATIONS
	DevaptViewModelClass.add_public_method('get_items_types', {}, cb_get_items_types);
	DevaptViewModelClass.add_public_method('get_fields_types', {}, cb_get_fields_types);
	
	
	// PROPERTIES
	DevaptViewModelClass.add_public_bool_property('is_view_model', 'object is a ViewModel', true, false, true, []);
	
	DevaptViewModelClass.add_public_str_property('source', 'model datas source', 'inline', true, false, []);
	DevaptViewModelClass.add_public_str_property('source_format', 'model datas source format', 'array', false, false, []);
	
	DevaptViewModelClass.add_public_object_property('view', 'View object linked with the model', null, true, false, []);
	DevaptViewModelClass.add_public_object_property('recordset', 'Model datas result for the items query', null, true, false, []);
	
	DevaptViewModelClass.add_public_object_property('linked_record', 'Linked record', null, true, false, []);
	
	DevaptViewModelClass.add_public_array_property('items_types', 'Items types', null, true, false, [], 'string', '|');
	DevaptViewModelClass.add_public_array_property('fields_types', 'Fields types', null, true, false, [], 'string', '|');
	
	
	// SETTINGS
	DevaptViewModelClass.add_public_object_property('model', 'Model object linked with the view', null, false, false, []);
	DevaptViewModelClass.add_public_str_property('model_name', 'Model name linked with the view', null, false, false, []);
	
	
	return DevaptViewModelClass;
} );