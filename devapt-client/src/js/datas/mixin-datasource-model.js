/**
 * @file        datas/mixin-datasource-model.js
 * @desc        Mixin for model data source
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class'],
function(Devapt, DevaptTypes, DevaptClass)
{
	/**
	 * @mixin				DevaptMixinDatasoureModel
	 * @public
	 * @desc				Mixin for model data source
	 */
	var DevaptMixinDatasoureModel = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureModel
		 * @desc				Init model data source
		 * @return {nothing}
		 */
		init_data_source_model: function(self)
		{
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_model()';
			self.enter(context, '');
			
			
			var promise = self.get_items_model();
			
			
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
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_model()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
			// GET ITEM FROM MODEL SOURCE
			if ( self.items_source === 'model' )
			{
				// var query = null;
				var model_promise = self.get_items_model();
				
				
				// ITERATE ON RECORDS
				if (self.items_iterator === 'records')
				{
					self.step(context, 'iterator is records');
					
					model_promise.then(
						function(model) {
							// console.log(context + '[' + self.name + ':model is found');
							self.assertNotNull(context, 'model', model);
							self.assertNotNull(context, 'self.items_model_obj', self.items_model_obj);
							
							var engine_promise = self.items_model_obj.get_engine();
							
							return engine_promise;
						},
						function()
						{
							console.error('model promise failed', context);
						}
					).then(
						function(engine)
						{
							// console.log(context + '[' + self.name + ':engine is found');
							self.assertNotNull(context, 'engine', engine);
							
							var query = self.get_query();
							if ( ! DevaptTypes.is_object(query) )
							{
								return engine.read_all_records();
							}
							
							return engine.read_records(query);
						},
						function()
						{
							console.error('engine promise failed', context);
						}
					).then(
						function(result)
						{
							// console.log(context + '[' + self.name + ':result is found');
							var items = [];
							
							if ( DevaptTypes.is_object(result) )
							{
								if (result.count > 0)
								{
									items = result.records;
								}
							}
							
							deferred.resolve(items);
							
							return items_promise;
						}
					);
					
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return items_promise;
				}
				
				
				// ITERATE ON FIELDS
				if (self.items_iterator === 'fields')
				{
					self.step(context, 'iterator is fields');
					
					model_promise.then(
						function(model)
						{
							self.assertNotNull(context, 'model', model);
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
							
							self.items_records = items;
							self.items_records_count = items.length;
							
							deferred.resolve(items);
						},
						function()
						{
							console.error('engine promise failed', context);
						}
					);
					
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return items_promise;
				}
			}
			
			// BAD SOURCE SOURCE
			deferred.reject();
			
			
			self.leave(context, self.msg_failure);
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
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinDatasoureModelClass.build_class();
	
	
	return DevaptMixinDatasoureModelClass;
}
);