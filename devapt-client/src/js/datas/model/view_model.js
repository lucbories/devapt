/**
 * @file        datas/model/view_model.js
 * @desc        ModelView class to interact with a model and a view and to deal with functional rules
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
define([
	'Devapt', 'core/types', 'core/resources', 'core/traces-memory',
	'object/class', 'object/object',
	'datas/model/model', 'datas/query', 'datas/model/shared_recordset', 'datas/model/view_model-mixin-crudable', 'datas/model/view_model-mixin-selectable',
	'views/view'],
function(
	Devapt, DevaptTypes, DevaptResources, DevaptTracesMemory,
	DevaptClass, DevaptObject,
	DevaptModel, DevaptQuery, DevaptSharedRecordSet, DevaptViewModelMixinCrudable, DevaptViewModelMixinSelectable,
	DevaptView)
{
	/**
	 * @public
	 * @class				DevaptViewModel
	 * @desc				ModelView class to interact with a model and a view and to deal with functional rules
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
		// DEBUG
		// self.trace=true;
		
		// CONSTRUCTOR BEGIN
		var context = 'constructor';
		self.enter(context, '');
		
		
		// INIT PROMISES
		var model_promise = null;
		var view_promise = null;
		self.ready_promise = null;
		
		try
		{
			// SET QUERY
			if ( ! DevaptTypes.is_object(self.query) || ! self.query.is_query )
			{
				self.step(context, 'set query');
				var query_name = self.name + '_query';
				self.query = DevaptQuery.create(query_name, {});
			}
			
			
			// SET MODEL
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
						
						model_promise = DevaptResources.get_resource_instance(self.model_name);
						
						break;
					}
					
					case 'logs':
					{
						self.step(context, 'source is logs');
						
						var settings = {
							"name":"MODEL_AUTH_GROUPS",
							
							"class_type":"model",
							
							"access":{"create":false,"read":true,"update":false,"delete":false},
							
							"role_read":"ROLE_LOGS_READ",
							"role_create":"ROLE_LOGS_CREATE",
							"role_update":"ROLE_LOGS_UPDATE",
							"role_delete":"ROLE_LOGS_DELETE",
							
							"engine":{
								"name":"LOCAL_LOGS_engine",
								"source":"array",
								"provider_cb": function(arg_item, arg_index)
									{
										if ( DevaptTypes.is_null(arg_item) )
										{
											return DevaptTracesMemory.get_logs();
										}
										
										if ( DevaptTypes.is_integer(arg_index) )
										{
											DevaptTracesMemory.logs[arg_index] = arg_item;
										}
										else
										{
											DevaptTracesMemory.logs.push(arg_item);
										}
										
										return DevaptTracesMemory.get_logs();
									}
							},
							
							"fields":{
								"level":{
									"type":"String",
									"label":"Level"
								},
								"class_name":{
									"type":"String",
									"label":"Class"
								},
								"object_name":{
									"type":"String",
									"label":"Object"
								},
								"method_name":{
									"type":"String",
									"label":"Method"
								},
								"context":{
									"type":"String",
									"label":"Context"
								},
								"step":{
									"type":"String",
									"label":"Step"
								},
								"text":{
									"type":"String",
									"label":"Text"
								},
							}
						};
						
						model_promise = Devapt.create('DevaptModel', settings);
						// console.log(DevaptTracesMemory.logs, 'DevaptTracesMemory.logs');
						// console.log(model_promise, 'model_promise');
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
						
						var engine_settings = { name:self.name + '_engine', records_array:items };
						// console.log(engine_settings, context + ':engine_settings');
						
						var engine_promise = Devapt.create('StorageArray', engine_settings);
						self.assert_object(context, 'engine_promise', engine_promise);
						
						model_promise = engine_promise.then(
							function(engine_obj)
							{
								self.step(context, 'array engine is created');
								
								// console.log(items, context + ':items');
								// console.log(engine_obj, context + ':array engine');
								
								return Devapt.create('Model', { name: self.name + '_model', engine:engine_obj });
							}
						);
						
						break;
					}
				}
				
				self.step(context, 'check model promise');
				
				self.assert_object(context, 'model_promise', model_promise);
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
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		try
		{
			// SET VIEW
			if ( ! DevaptTypes.is_object(self.view) || ! self.view.is_view )
			{
				self.step(context, 'set view');
				
				if ( ! DevaptTypes.is_string(self.view) )
				{
					self.error(context, 'bad view name');
					return;
				}
				
				view_promise = DevaptResources.get_resource_instance(self.view);
			}
			else
			{
				self.step(context, 'view is set');
				view_promise = Devapt.promise_resolved(self.view);
			}
			
			
			// UDPATE QUERY WITH VIEW
			view_promise.then(
				function(view)
				{
					self.step(context, 'view is found');
					self.view = view;
					self.query.fields = self.view.items_fields;
				},
				function()
				{
					self.error(context, 'bad view resource');
				}
			);
			
			
			// SET READY PROMISE
			self.assert_object(context, 'model_promise', model_promise);
			self.assert_object(context, 'view_promise', view_promise);
			self.ready_promise = Devapt.promise_all([model_promise, view_promise]);
			self.ready_promise = self.ready_promise.then(
				function()
				{
					self.step(context, 'ready promise is resolved');
					// console.log(context, 'ready promise is resolved');
					
					return self;
				}
			);
			
			
			// SET RECORDS
			if ( DevaptTypes.is_object(self.records) && self.records.is_recordset )
			{
				self.step(context, 'records is set');
			}
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		// CONSTRUCTOR END
		self.leave(context, Devapt.msg_success_promise);
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
			&& Devapt.is_object(self.ready_promise) && Devapt.is_promise(self.ready_promise)
			&& Devapt.is_object(self.model) && self.model.is_model
			&& Devapt.is_object(self.query) && self.query.is_query
			&& Devapt.is_object(self.view) && self.view.is_view
			// && Devapt.is_object(self.records) && self.records.is_recordset
			;
		self.value('is valid ?', 'result', result);
		return result;
	};
	
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.get_recordset()
	 * @desc					Get recordset object
	 * @return {object}			SharedRecordSet object
	 */
	var cb_get_recordset = function ()
	{
		var self = this;
		self.step('get recordset', '');
		return self.recordset;
	};
	
	
	
	/**
	 * @memberof				DevaptViewModel
	 * @public
	 * @method					DevaptViewModel.get_records()
	 * @desc					Get all records object
	 * @return {array}			Records array
	 */
	var cb_get_records = function ()
	{
		var self = this;
		self.step('get records', '');
		self.assert_object(context, 'recordset', self.recordset);
		return self.recordset.records;
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
	
	
	
	/* --------------------------------------------- UTILS OPERATIONS ------------------------------------------------ */
	
	/**
	 * @public
	 * @memberof			DevaptViewModel
	 * @method				DevaptViewModel.get_items_types_array()
	 * @desc				Get items types array
	 * @return {promise}
	 */
	var cb_get_items_types_array = function()
	{
		var self = this;
		// self.trace=true;
		var context = 'get_items_types_array()';
		self.enter(context, '');
		
		
		var deferred = Devapt.defer();
		var types_promise = Devapt.promise(deferred);
		
		self.value(context, 'source', self.source);
		// console.log('source', self.source);
		
		// GET ITEMS TYPES FROM INLINE SOURCE
		if ( self.source === 'inline' || self.source === 'logs' || self.source === 'events'
			|| self.source === 'classes' || self.source === 'resources' || self.source === 'views'
			|| self.source === 'models' || self.source === 'resource-api'
			|| self.source === 'server-api' || self.source === 'view-api' || self.source === 'crud-api' )
		{
			self.step(context, 'inline source');
			
			var types = [];
			
			if ( DevaptTypes.is_not_empty_array(self.view.items_types) )
			{
				types = self.view.items_types;
			}
			
			self.value(context, 'types', types);
			deferred.resolve(types);
			
			self.leave(context, Devapt.msg_success_promise);
			return types_promise;
		}
		
		
		// GET ITEMS TYPES FROM MODEL SOURCE
		if ( self.source === 'model' )
		{
			self.step(context, 'model source');
			
			self.ready_promise.then(
				function()
				{
					self.step(context, 'model found');
					
					// ITERATE ON ONE FIELD RECORDS
					if (self.view.items_iterator === 'field_editor')
					{
						self.step(context, 'iterator is field_editor');
						
						var types = ['object'];
						
						deferred.resolve(types);
						return types_promise;
					}
					
					// ITERATE ON RECORDS
					if (self.view.items_iterator === 'records')
					{
						self.step(context, 'iterator is records');
						
						var types = self.model.get_fields_types(self.view.items_fields);
						deferred.resolve(types);
						return types_promise;
					}
					
					// ITERATE ON FIELDS
					if (self.view.items_iterator === 'fields')
					{
						self.step(context, 'iterator is fields');
						
						// FIELD NAME / FIELD VALUE
						var types = ['object'];
						
						deferred.resolve(types);
						return types_promise;
					}
					
					// BAD ITERATOR
					self.step(context, 'iterator is bad [' + self.view.items_iterator + ']');
					deferred.reject();
					return types_promise;
				}
			);
			
			self.leave(context, self.msg_success_promise);
			return types_promise;
		}
		
		
		// DEFAULT SOURCE
		deferred.reject();
		
		
		self.leave(context, Devapt.msg_failure_promise);
		return types_promise;
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
		self.enter(context, arg_field_name);
		
		
		// DEBUG
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
		self.view.fire_event('devapt.query.updated');
		self.view.fire_event('devapt.query.filters.added', [field_filter]);
		
		
		self.leave(context, Devapt.msg_success);
		return true;
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-02-02',
			updated:'2015-02-08',
			description:'Business rules between model and view.'
		},
		mixins: [DevaptViewModelMixinCrudable, DevaptViewModelMixinSelectable]
	};
	var parent_class = DevaptObject;
	var DevaptViewModelClass = new DevaptClass('DevaptViewModel', parent_class, class_settings);
	
	
	// METHODS
	DevaptViewModelClass.infos.ctor = cb_constructor;
	
	DevaptViewModelClass.add_public_method('is_valid', {}, cb_is_valid);
	
	DevaptViewModelClass.add_public_method('get_recordset', {}, cb_get_recordset);
	DevaptViewModelClass.add_public_method('get_records', {}, cb_get_records);
	DevaptViewModelClass.add_public_method('get_model', {}, cb_get_model);
	DevaptViewModelClass.add_public_method('get_query', {}, cb_get_query);
	DevaptViewModelClass.add_public_method('get_view', {}, cb_get_view);
	
	DevaptViewModelClass.add_public_method('add_field_value_filter', {}, cb_add_field_value_filter);
	
	DevaptViewModelClass.add_public_method('get_items_types_array', {}, cb_get_items_types_array);
	
	
	// PROPERTIES
	DevaptViewModelClass.add_public_bool_property('is_view_model', 'object is a ViewModel', true, false, true, []);
	
	DevaptViewModelClass.add_public_str_property('source', 'model datas source', 'inline', true, false, []);
	DevaptViewModelClass.add_public_str_property('source_format', 'model datas source format', 'array', false, false, []);
	
	DevaptViewModelClass.add_public_object_property('query', 'View query object for the model', null, false, false, []);
	DevaptViewModelClass.add_public_object_property('view', 'View object linked with the model', null, true, false, []);
	DevaptViewModelClass.add_public_object_property('model', 'Model object linked with the view', null, false, false, []);
	DevaptViewModelClass.add_public_str_property('model_name', 'Model name linked with the view', null, false, false, []);
	DevaptViewModelClass.add_public_object_property('recordset', 'Model datas result for the query', null, true, false, []);
	
	
	return DevaptViewModelClass;
} );