/**
 * @file        datas/mixin-datasource.js
 * @desc        Mixin for data source use
 * @see			DevaptModel, DevaptStorage
 * @ingroup     DEVAPT_CORE
 * @date        2014-10-11
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/options', 'core/resources', 'datas/query', 'core/classes',
	'datas/mixin-datasource-inline', 'datas/mixin-datasource-events', 'datas/mixin-datasource-classes', 'datas/mixin-datasource-resources',
	'datas/mixin-datasource-logs', 'datas/mixin-datasource-model'],
function(Devapt, DevaptTypes, DevaptOptions, DevaptResources, DevaptQuery, DevaptClasses,
	DevaptMixinDatasoureInline, DevaptMixinDatasoureEvents, DevaptMixinDatasoureClasses, DevaptMixinDatasoureResources,
	DevaptMixinDatasoureLogs, DevaptMixinDatasoureModel)
{
	/**
	 * @mixin				DevaptMixinDatasoure
	 * @public
	 * @desc				Mixin for data source use
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
			
			
			// INIT LAST DISPLAYED ITEM INDEX
			self.items_last_index = null;
			
			// PROCESS CUSTOM INIT
			self.assertNotEmptyString(context, 'source', self.items_source);
			switch(self.items_source)
			{
				case 'inline':
					// LOAD MIXIN INLINE
					self.register_mixin(DevaptMixinDatasoureInline);
					self.init_data_source_inline();
					break;
					
				case 'model':
					// LOAD MIXIN MODEL
					self.register_mixin(DevaptMixinDatasoureModel);
					self.init_data_source_model();
					break;
					
				case 'classes':
					// LOAD MIXIN CLASSES
					self.register_mixin(DevaptMixinDatasoureClasses);
					self.init_data_source_classes();
					break;
					
				case 'logs':
					// LOAD MIXIN CLASSES
					self.register_mixin(DevaptMixinDatasoureLogs);
					self.init_data_source_logs();
					break;
					
				case 'events':
					// LOAD MIXIN EVENTS
					self.register_mixin(DevaptMixinDatasoureEvents);
					self.init_data_source_events();
					break;
					
				case 'resources':
					// LOAD MIXIN RESOURCES
					self.register_mixin(DevaptMixinDatasoureResources);
					self.init_data_source_resources();
					break;
					
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
		 * @desc				Get items array
		 * @return {promise}
		 */
		get_items_array: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array()';
			self.enter(context, '');
			
			
			// SWITCH ON DATA SOURCE
			self.assertNotEmptyString(context, 'source', self.items_source);
			var promise = null;
			switch(self.items_source)
			{
				case 'inline':
					// LOAD MIXIN INLINE ITEMS
					promise = self.get_items_array_inline();
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return promise;
					
				case 'model':
					// LOAD MIXIN MODEL ITEMS
					promise = self.get_items_array_model();
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return promise;
					
				case 'classes':
					// LOAD MIXIN CLASSES ITEMS
					promise = self.get_items_array_classes();
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return promise;
					
				case 'logs':
					// LOAD MIXIN CLASSES ITEMS
					promise = self.get_items_array_logs();
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return promise;
					
				case 'events':
					// LOAD MIXIN EVENTS ITEMS
					promise = self.get_items_array_events();
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return promise;
					
				case 'resources':
					// LOAD MIXIN RESOURCES ITEMS
					promise = self.get_items_array_resources();
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return promise;
			}
			
			
			// BAD DATA SOURCE
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
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
			if ( self.items_source === 'inline' || self.items_source === 'logs' || self.items_source === 'events' || self.items_source === 'classes' || self.items_source === 'resources' || self.items_source === 'views' || self.items_source === 'models' )
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
				childs: {
					// opts:{
						// name: 'opts',
						// type: 'array',
						// aliases: [],
						// default_value: [],
						// array_separator: '|',
						// array_type: 'object',
						// format: '',
						// is_required: false,
						// childs: {}
					// }
				}
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