/**
 * @file        datas/mixin-datasource-model.js
 * @desc        Mixin for model data source
 * @see			...
 * @ingroup     DEVAPT_DATAS
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'datas/query'],
function(Devapt, DevaptTypes, DevaptClass, DevaptQuery)
{
	/**
	 * @mixin				DevaptMixinDatasoureModel
	 * @public
	 * @desc				Mixin for model data source
	 */
	var DevaptMixinDatasoureModel = 
	{
		mixin_trace_datasource: false,
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureModel
		 * @desc				Init model data source
		 * @return {nothing}
		 */
		init_data_source_model: function(self)
		{
			self.push_trace(self.trace, DevaptMixinDatasoureModel.mixin_trace_datasource);
			var context = 'init_data_source_model()';
			self.enter(context, '');
			
			
			var promise = self.get_items_model();
			
			
			// TODO FINISH QUERY SETTINGS
			
			self.view_model.get_query().fields = self.items_fields;
			// var query_settings = {
				// fields:self.items_fields
			// };
			// var query = DevaptQuery.create(self.name + '_query', query_settings);
			// if (self.items_distinct)
			// {
				// query.set_select_distinct();
			// }
			// self.add_query(query);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureModel
		 * @desc				Get items array for model data source
		 * @return {promise}
		 */
		get_items_array_model: function()
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinDatasoureModel.mixin_trace_datasource);
			var context = 'get_items_array_model()';
			self.enter(context, '');
			
			
			self.value(context, 'self.items_source', self.items_source);
			self.value(context, 'self.items_iterator', self.items_iterator);
			
			
			// GET ITEM FROM MODEL SOURCE
			if ( self.items_source === 'model' )
			{
				var model_promise = self.get_items_model();
				
				
				// ITERATE ON ONE FIELD VALUES
				if (self.items_iterator === 'field_editor')
				{
					self.step(context, 'iterator is field editor');
					
					// INIT PROMISE
					// var deferred = Devapt.defer();
					// var items_promise = Devapt.promise(deferred);
					
					var items_promise = model_promise.then(
						function(model)
						{
							self.step(context, 'model is found');
							
							// GET FIELD
							var field_name = self.items_fields[0];
							if ( ! DevaptTypes.is_not_empty_str(field_name) )
							{
								console.error('bad field name', context);
								// deferred.reject();
								throw new Error(context + ':bad field name');
								// return;
							}
							var field_obj = model.get_field(field_name);
							if ( ! DevaptTypes.is_object(field_obj) )
							{
								console.error('bad field object', context);
								// deferred.reject();
								throw new Error(context + ':bad field object');
								// return;
							}
							
							// GET FIELD ATTRIBUTES
							var type_str = DevaptTypes.to_string(field_obj.field_value.type, 'string').toLocaleLowerCase();
							var name_str = DevaptTypes.to_string(field_obj.name, null);
							var label_str = DevaptTypes.to_string(field_obj.label, null);
							self.value(context, 'type_str', type_str);
							self.value(context, 'name_str', name_str);
							self.value(context, 'label_str', label_str);
							
							return field_obj.get_available_values();
						},
						function()
						{
							console.error('model promise failed', context);
						}
					).then(
						function(result)
						{
							self.step(context, 'result is found');
							// console.log(result, context + '[' + self.name + ']:result is found');
							
							// INIT ITEMS
							var items = [];
							
							// CHECK RESULT
							if ( DevaptTypes.is_object(result) && result.is_resultset )
							{
								if (result.get_count() > 0)
								{
									items = result.get_records();
									// console.log(items, context + '[' + self.name + ']:items are found');
								}
							}
							
							self.items_records = items;
							self.items_records_count = items.length;
							
							// deferred.resolve(items);
							
							return items;
						},
						function()
						{
							console.error('result promise failed', context);
						}
					);
					
					
					self.leave(context, Devapt.msg_success_promise);
					self.pop_trace();
					return items_promise;
				}
				
				
				// ITERATE ON RECORDS
				if (self.items_iterator === 'records')
				{
					self.step(context, 'iterator is records');
					
					// GET ITEMS RECORDS
					var items_promise = self.get_items_array_model_with_iterator_records(model_promise);
					items_promise.then(
						function(items)
						{
							// console.log(items, context + '[' + self.name + ']:items are found');
							
							self.items_records = items;
							self.items_records_count = items.length;
						},
						function()
						{
							console.error('items promise failed', context);
						}
					);
					
					self.leave(context, Devapt.msg_success_promise);
					self.pop_trace();
					return items_promise;
				}
				
				
				// ITERATE ON ONE RECORD FIELDS
				if (self.items_iterator === 'fields')
				{
					self.step(context, 'iterator is fields');
					
					// GET ITEMS RECORDS
					var items_promise = self.get_items_array_model_with_iterator_fields(model_promise);
					items_promise.then(
						function(items)
						{
							// console.log(items, context + '[' + self.name + ':items are found');
							
							self.items_records = items;
							self.items_records_count = items.length;
						},
						function()
						{
							console.error('items promise failed', context);
						}
					);
					
					self.leave(context, Devapt.msg_success_promise);
					self.pop_trace();
					return items_promise;
				}
			}
			
			
			// BAD SOURCE SOURCE
			// var deferred = Devapt.defer();
			// deferred.reject();
			
			
			self.leave(context, Devapt.msg_failure);
			self.pop_trace();
			// return deferred.promise;
			return Devapt.promise_rejected('bad items source');
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureModel
		 * @desc				Get items array for model data source
		 * @param {object}		arg_model_promise	get model promise
		 * @return {promise}	get records promise
		 */
		get_items_array_model_with_iterator_records: function(arg_model_promise)
		{
			var self = this;
			// self.trace=true;
			self.push_trace(self.trace, DevaptMixinDatasoureModel.mixin_trace_datasource);
			var context = 'get_items_array_model_with_iterator_records(model promise)';
			self.enter(context, '');
			
			
			// INIT PROMISE
			// var deferred = Devapt.defer();
			// var items_promise = deferred.promise;
			
			// GET MODEL STORAGE ENGINE
			var items_promise = arg_model_promise.then(
				function(model)
				{
					// self.trace=true;
					self.step(context, 'model is found');
					
					self.value(context, 'model', model.name);
					
					// console.log(context + '[' + self.name + ']:model is found');
					self.assert_not_null(context, 'model', model);
					self.assert_not_null(context, 'self.items_model_obj', self.items_model_obj);
					
					var engine_promise = self.items_model_obj.get_engine();
					
					return engine_promise;
				},
				function()
				{
					console.error('model promise failed', context);
				}
			).then(
				// SEND ENGINE READ REQUEST
				function(engine)
				{
					// self.trace=true;
					self.step(context, 'engine is found');
					// console.log(context + '[' + self.name + ']:engine is found');
					self.assert_not_null(context, 'engine', engine);
					
					var query = self.get_query();
					
					if ( ! DevaptTypes.is_object(query) )
					{
						self.step(context, 'read_all_records');
						return engine.read_all_records();
					}
					
					if (self.items_distinct)
					{
						self.step(context, 'read distinct records');
						if ( DevaptTypes.is_not_empty_str(self.items_distinct_field) )
						{
							self.step(context, 'read distinct one records');
							query.set_select_distinct_one();
							query.set_one_field(self.items_distinct_field);
						}
						else
						{
							self.step(context, 'read distinct many records');
							query.set_select_distinc();
						}
					}
					
					self.step(context, 'read query');
					var resultset_promise = engine.read_records(query);
					return resultset_promise;
				},
				function()
				{
					console.error('engine promise failed', context);
				}
			);
			
			items_promise = items_promise.then(
				// PROCESS ENGINE READ RESPONSE
				function(result)
				{
					// self.trace=true;
					self.step(context, 'result is found');
					// console.log(result, context + '[' + self.name + ']:result is found');
					
					// INIT ITEMS
					var items = [];
					
					// CHECK RESULT
					if ( DevaptTypes.is_object(result) && result.is_resultset )
					{
						if (result.get_count() > 0)
						{
							items = result.get_records();
						}
					}
					
					return items;
				},
				function()
				{
					console.error('result promise failed', context);
				}
			);
			
			
			self.leave(context, Devapt.msg_success_promise);
			self.pop_trace();
			return items_promise;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureModel
		 * @desc				Get items array for model data source
		 * @param {object}		arg_model_promise	get model promise
		 * @return {promise}
		 */
		get_items_array_model_with_iterator_fields: function(arg_model_promise)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinDatasoureModel.mixin_trace_datasource);
			var context = 'get_items_array_model_with_iterator_records(model promise)';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = Devapt.defer();
			var items_promise = deferred.promise;
			
			
			arg_model_promise.then(
				function(model)
				{
					self.step(context, 'model is found');
					// console.log(context + '[' + self.name + ']:model is found');
					self.assert_not_null(context, 'model', model);
					
					// INIT ITEMS
					var items = [];
					
					// GET CURRENT RECORD
					var record = self.items_current_record;
					if ( DevaptTypes.is_object(record) )
					{
						self.step(context, 'current record is found');
						
						// LOOP ON FIELDS
						for(field_index in self.items_fields)
						{
							var field_name = self.items_fields[field_index];
							var field_value = record[field_name];
							var field_record = { 'field_name': field_name, 'field_value': field_value };
							
							items.push(field_record);
						}
					}
					
					// RESOLVE PROMISE
					deferred.resolve(items);
					// console.log(items, 'current_record.items');
					return items_promise;
				},
				function()
				{
					console.error('engine promise failed', context);
				}
			);
			
			
			self.leave(context, Devapt.msg_success_promise);
			self.pop_trace();
			return items_promise;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-10-15',
			'updated':'2014-12-06',
			'description':'Mixin methods for classes datas source.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinDatasoureModelClass = new DevaptClass('DevaptMixinDatasoureModel', null, class_settings);
	
	// METHODS
	// DevaptMixinDatasoureModelClass.infos.ctor = DevaptMixinDatasoureModel.init_data_source_model;
	DevaptMixinDatasoureModelClass.add_public_method('init_data_source_model', {}, DevaptMixinDatasoureModel.init_data_source_model);
	DevaptMixinDatasoureModelClass.add_public_method('get_items_array_model', {}, DevaptMixinDatasoureModel.get_items_array_model);
	DevaptMixinDatasoureModelClass.add_public_method('get_items_array_model_with_iterator_records', {}, DevaptMixinDatasoureModel.get_items_array_model_with_iterator_records);
	DevaptMixinDatasoureModelClass.add_public_method('get_items_array_model_with_iterator_fields', {}, DevaptMixinDatasoureModel.get_items_array_model_with_iterator_fields);
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinDatasoureModelClass.build_class();
	
	
	return DevaptMixinDatasoureModelClass;
}
);