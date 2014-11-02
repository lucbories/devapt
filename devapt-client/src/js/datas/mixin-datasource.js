/**
 * @file        datas/mixin-model-read.js
 * @desc        Mixin use datas
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-10-11
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/options', 'core/resources', 'datas/query', 'core/events', 'core/classes'],
function(Devapt, DevaptTypes, DevaptOptions, DevaptResources, DevaptQuery, DevaptEvents, DevaptClasses)
{
	/**
	 * @mixin				DevaptMixinDatasoure
	 * @public
	 * @desc				Mixin of template methods
	 */
	var DevaptMixinDatasoure = 
	{
		/**
		 * @memberof			DevaptMixinDatasoure
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_datasource: false,
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoure
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_datasource: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'mixin_init_datasource()';
			self.enter(context, '');
			
			self.init_data_source();
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoure
		 * @desc				Init data source
		 * @return {nothing}
		 */
		init_data_source: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source()';
			self.enter(context, '');
			
			
			self.items_last_index = null;
			
			self.assertNotEmptyString(context, 'source', self.items_source);
			switch(self.items_source)
			{
				case 'inline':
					// LOAD MIXIN INLINE
					self.init_data_source_inline();
					break;
					
				case 'model':
					// LOAD MIXIN MODEL
					self.init_data_source_model();
					break;
					
				case 'events':
					// LOAD MIXIN EVENTS
					self.init_data_source_events();
					break;
					
				// case 'resources':
					// LOAD MIXIN RESOURCES
					// self.init_data_source_resources();
					// break;
					
				default:
					self.error(context, 'bad items source: [' + self.items_source + ']');
					return;
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoure
		 * @desc				Init data source options
		 * @param {array}		arg_items		items array
		 * @return {nothing}
		 */
		init_data_source_options: function(arg_items)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_options(items)';
			self.enter(context, '');
			
			
			// PREPARE OPTIONS
			if ( DevaptTypes.is_array(arg_items) && self.items_options && self.items_options.length >= arg_items.length)
			{
				self.step(context, 'register items options');
				
				var index = 0;
				for(index = 0 ; index < self.items_options.length ; index++)
				{
					var item_options = self.items_options[index];
					
					if ( DevaptTypes.is_object(item_options) )
					{
						continue;
					}
					
					if ( DevaptTypes.is_string(item_options) )
					{
						var item_options_array = item_options.split('=');
						if ( item_options_array.length === 2 )
						{
							var item_options_obj = {};
							item_options_obj[ item_options_array[0] ] = item_options_array[1];
							self.items_options[index] = item_options_obj;
							continue;
						}
					}
					
					self.items_options[index] = { value: item_options };
				}
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoure
		 * @desc				Init inline data source
		 * @return {nothing}
		 */
		init_data_source_inline: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_inline()';
			self.enter(context, '');
			
			
			// PREPARE OPTIONS
			if ( self.items_inline && self.items_options && self.items_options.length >= self.items_inline.length)
			{
				self.step(context, 'register items options');
				
				self.init_data_source_options(self.items_inline);
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoure
		 * @desc				Init model data source
		 * @return {nothing}
		 */
		init_data_source_model: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_model()';
			self.enter(context, '');
			
			
			var promise = self.get_items_model();
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoure
		 * @desc				Init events data source
		 * @return {nothing}
		 */
		init_data_source_events: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_events()';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoure
		 * @desc				Get items array
		 * @return {promise}
		 */
		get_items_array: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array()';
			self.enter(context, '');
			
			
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
			
			// GET ITEMS FROM INLINE SOURCE
			if ( self.items_source === 'inline' )
			{
				var items = [];
				if ( self.items_source_format === 'json' )
				{
					var json_str = self.items_inline.join(',');
					var json_obj = $.parseJSON(json_str);
					// console.log(json_obj);
					items = json_obj;
				}
				else
				{
					items = self.items_inline;
				}
				
				deferred.resolve(items);
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return items_promise;
			}
			
			
			// GET ITEMS FROM EVENTS SOURCE
			if ( self.items_source === 'events' )
			{
				var items = [];
				var event_index = self.items_last_index ? self.items_last_index : 0;
				for( ; event_index < DevaptEvents.all_events.length ; event_index++)
				{
					var event = DevaptEvents.all_events[event_index];
					var record = {};
					record['name']				= event.name;
					record['ts']				= event.fired_ts;
					record['target_name']		= event.target_object.name;
					record['operands_count']	= event.operands_array.length;
					items.push(record);
				}
				self.items_last_index = event_index;
				// console.log(items, 'events');
				
				if ( self.items_source_format === 'json' )
				{
					var json_str = items.join(',');
					var json_obj = $.parseJSON(json_str);
					// console.log(json_obj);
					items = json_obj;
				}
				
				deferred.resolve(items);
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return items_promise;
			}
			
			
			// GET ITEMS FROM EVENTS SOURCE
			if ( self.items_source === 'resources' )
			{
				var items = [];
				for(resource_name in DevaptResources.resources_instances_by_name)
				{
					var resource = DevaptResources.resources_instances_by_name[resource_name];
					var record = {};
					record['name']				= resource.name;
					record['class_name']		= resource.class_name;
					record['trace']				= resource.trace ? 'true' : 'false';
					items.push(record);
				}
				// console.log(items, 'resources');
				
				if ( self.items_source_format === 'json' )
				{
					var json_str = items.join(',');
					var json_obj = $.parseJSON(json_str);
					// console.log(json_obj);
					items = json_obj;
				}
				
				deferred.resolve(items);
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return items_promise;
			}
			
			
			// GET ITEMS FROM CLASSES SOURCE
			if ( self.items_source === 'classes' )
			{
				var items = [];
				for(class_index in DevaptClasses.introspect_classes_array)
				{
					var class_record = DevaptClasses.introspect_classes_array[class_index];
					var record = {};
					record['name']			= class_record.name;
					record['author']		= class_record.author;
					record['updated']		= class_record.updated;
					record['description']	= class_record.description;
					items.push(record);
				}
				// console.log(items, 'resources');
				
				if ( self.items_source_format === 'json' )
				{
					var json_str = items.join(',');
					var json_obj = $.parseJSON(json_str);
					// console.log(json_obj);
					items = json_obj;
				}
				
				deferred.resolve(items);
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return items_promise;
			}
			
			
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
							self.assertNotNull(context, 'model', model);
							self.assertNotNull(context, 'self.items_model', self.items_model);
							
							var engine_promise = self.items_model.get_engine();
							
							return engine_promise;
						},
						function()
						{
							console.error('model promise failed', context);
						}
					).then(
						function(engine)
						{
							// console.log(engine, 'engine');
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
			
			
			// DEFAULT SOURCE
			deferred.reject();
			
			
			self.leave(context, self.msg_failure);
			self.pop_trace();
			return items_promise;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoure
		 * @desc				Get items types array
		 * @return {promise}
		 */
		get_items_types_array: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_types_array()';
			self.enter(context, '');
			
			
			var deferred = $.Deferred();
			var types_promise = deferred.promise();
			
			
			// GET ITEMS TYPES FROM INLINE SOURCE
			if ( self.items_source === 'inline' || self.items_source === 'events' || self.items_source === 'classes' || self.items_source === 'resources' || self.items_source === 'views' || self.items_source === 'models' )
			{
				var types = [];
				
				if ( DevaptTypes.is_not_empty_array(self.items_types) )
				{
					types = self.items_types;
				}
				
				deferred.resolve(types);
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return types_promise;
			}
			
			
			// GET ITEMS TYPES FROM MODEL SOURCE
			if ( self.items_source === 'model' )
			{
				var model_promise = self.get_items_model();
				model_promise.then(
					function(model)
					{
						self.step(context, 'model found');
						
						// ITERATE ON RECORDS
						if (self.items_iterator === 'records')
						{
							self.step(context, 'iterator is records');
							
							var types = model.get_fields_types(self.items_fields);
							deferred.resolve(types);
							return types_promise;
						}
						
						// ITERATE ON FIELDS
						if (self.items_iterator === 'fields')
						{
							self.step(context, 'iterator is fields');
							
							// FIELD NAME / FIELD VALUE
							var types = ['object'];
							
							deferred.resolve(types);
							return types_promise;
						}
						
						// BAD ITERATOR
						self.step(context, 'iterator is bad [' + self.items_iterator + ']');
						deferred.reject();
						return types_promise;
					}
				);
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return types_promise;
			}
			
			
			// DEFAULT SOURCE
			deferred.reject();
			
			
			self.leave(context, self.msg_failure);
			self.pop_trace();
			return types_promise;
		}
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinDatasoure
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	DevaptMixinDatasoure.register_options = function(arg_prototype)
	{
		DevaptOptions.register_obj_option(arg_prototype, 'items_model',			null, false, ['model']);
		DevaptOptions.register_str_option(arg_prototype, 'items_model_name',	null, true, ['model_name']);
		
		DevaptOptions.register_bool_option(arg_prototype, 'items_autoload',		true, false, ['view_items_autoload']);
		DevaptOptions.register_str_option(arg_prototype, 'items_source',		'inline', false, ['view_items_source']); // inline / model / events / resources
		DevaptOptions.register_str_option(arg_prototype, 'items_source_format',	'array', false, ['view_items_source_format']); // json / array
	
		DevaptOptions.register_str_option(arg_prototype, 'items_iterator',		'records', false, []); // items iterator : records / fields
		DevaptOptions.register_array_option(arg_prototype, 'items_fields',		[], false, ',', 'String', []); // item fields
		DevaptOptions.register_str_option(arg_prototype, 'items_format',		null, false, []); // item format
		DevaptOptions.register_obj_option(arg_prototype, 'items_current_record',	null, false, []);
		DevaptOptions.register_obj_option(arg_prototype, 'items_refresh',		null, false, []);
		
		DevaptOptions.register_array_option(arg_prototype, 'items_records',		[], false, ',', 'Object', []); // items records
		DevaptOptions.register_int_option(arg_prototype, 'items_records_count',		0, false, []); // items records count
		
		DevaptOptions.register_option(arg_prototype, {
				name: 'items_inline',
				type: 'array',
				aliases: [],
				default_value: [],
				array_separator: ',',
				array_type: 'String',
				format: '',
				is_required: false,
				childs: {}
			}
		);
		
		DevaptOptions.register_option(arg_prototype, {
				name: 'items_options',
				type: 'array',
				aliases: [],
				default_value: [],
				array_separator: ',',
				array_type: 'String',
				format: '',
				is_required: false,
				childs: {}
			}
		);
		
		DevaptOptions.register_option(arg_prototype, {
				name: 'items_labels',
				type: 'array',
				aliases: [],
				default_value: [],
				array_separator: ',',
				array_type: 'String',
				format: '',
				is_required: false,
				childs: {}
			}
		);
		
		DevaptOptions.register_option(arg_prototype, {
				name: 'items_types',
				type: 'array',
				aliases: ['view_items_types'],
				default_value: ['view'],
				array_separator: ',',
				array_type: 'String',
				format: '',
				is_required: false,
				childs: {}
			}
		); // array of: view / html / callback / object (json) / record
		
		DevaptOptions.register_option(arg_prototype, {
				name: 'items_records_fields_names',
				type: 'array',
				aliases: ['view_items_records_fields'],
				default_value: [],
				array_separator: ',',
				array_type: 'String',
				format: '',
				is_required: false,
				childs: {}
			}
		);
		
		DevaptOptions.register_option(arg_prototype, {
				name: 'items_records_fields_types',
				type: 'array',
				aliases: ['view_items_records_types'],
				default_value: [],
				array_separator: ',',
				array_type: 'String',
				format: '',
				is_required: false,
				childs: {}
			}
		);
		
	};
	
	
	return DevaptMixinDatasoure;
}
);