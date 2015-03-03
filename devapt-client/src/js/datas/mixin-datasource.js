/**
 * @file        datas/mixin-datasource.js
 * @desc        Mixin for data source use
 * @see			DevaptModel, DevaptStorage
 * @ingroup     DEVAPT_DATAS
 * @date        2014-10-11
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class',
	'datas/mixin-datasource-inline', 'datas/mixin-datasource-events', 'datas/mixin-datasource-classes', 'datas/mixin-datasource-resources',
	'datas/mixin-datasource-logs', 'datas/mixin-datasource-model', 'datas/mixin-datasource-server-api'],
function(Devapt, DevaptTypes, DevaptClass,
	DevaptMixinDatasoureInline, DevaptMixinDatasoureEvents, DevaptMixinDatasoureClasses, DevaptMixinDatasoureResources,
	DevaptMixinDatasoureLogs, DevaptMixinDatasoureModel, DevaptMixinDatasoureServerApi)
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
		// mixin_trace_datasource: false,
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoure
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_datasource: function(self)
		{
			self.push_trace(self.trace, DevaptMixinDatasoure.mixin_trace_datasource);
			var context = 'mixin_init_datasource()';
			self.enter(context, '');
			
			
			// self.mixin_trace_datasource = true;
			
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
		init_data_source: function(self)
		{
			self.push_trace(self.trace, DevaptMixinDatasoure.mixin_trace_datasource);
			var context = 'init_data_source()';
			self.enter(context, '');
			
			
			// INIT LAST DISPLAYED ITEM INDEX
			self.items_last_index = null;
			
			// PROCESS CUSTOM INIT
			self.assert_not_empty_string(context, 'source', self.items_source);
			switch(self.items_source)
			{
				case 'inline':
					// LOAD MIXIN INLINE
					// self.register_mixin(DevaptMixinDatasoureInline);
					self.init_data_source_inline(self);
					break;
					
				case 'model':
					// LOAD MIXIN MODEL
					// self.register_mixin(DevaptMixinDatasoureModel);
					self.init_data_source_model(self);
					break;
					
				case 'classes':
					// LOAD MIXIN CLASSES
					// self.register_mixin(DevaptMixinDatasoureClasses);
					self.init_data_source_classes(self);
					break;
					
				case 'logs':
					// LOAD MIXIN CLASSES
					// self.register_mixin(DevaptMixinDatasoureLogs);
					self.init_data_source_logs(self);
					break;
					
				case 'events':
					// LOAD MIXIN EVENTS
					// self.register_mixin(DevaptMixinDatasoureEvents);
					self.init_data_source_events(self);
					break;
					
				case 'resources':
					// LOAD MIXIN RESOURCES
					// self.register_mixin(DevaptMixinDatasoureResources);
					self.init_data_source_resources(self);
					break;
					
				case 'server-api':
				case 'resource-api':
				case 'view-api':
				case 'crud-api':
					// LOAD MIXIN RESOURCES
					// self.register_mixin(DevaptMixinDatasoureCrudApi);
					self.init_data_source_server_api(self);
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
			self.push_trace(self.trace, DevaptMixinDatasoure.mixin_trace_datasource);
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
			self.push_trace(self.trace, DevaptMixinDatasoure.mixin_trace_datasource);
			var context = 'get_items_array()';
			self.enter(context, '');
			
			
			// console.log(self.items_source, context + '[' + self.name + ']:source');
			
			// SWITCH ON DATA SOURCE
			self.assert_not_empty_string(context, 'source', self.items_source);
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
					
				case 'server-api':
				case 'resource-api':
				case 'view-api':
				case 'crud-api':
					// LOAD MIXIN CRUD API ITEMS
					promise = self.get_items_array_server_api();
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return promise;
			}
			
			
			// BAD DATA SOURCE
			var deferred = Devapt.defer();
			var items_promise = deferred.promise;
			
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
			self.push_trace(self.trace, DevaptMixinDatasoure.mixin_trace_datasource);
			var context = 'get_items_types_array()';
			self.enter(context, '');
			
			
			var deferred = Devapt.defer();
			var types_promise = Devapt.promise(deferred);
			
			
			// GET ITEMS TYPES FROM INLINE SOURCE
			if ( self.items_source === 'inline' || self.items_source === 'logs' || self.items_source === 'events'
				|| self.items_source === 'classes' || self.items_source === 'resources' || self.items_source === 'views'
				|| self.items_source === 'models' || self.items_source === 'resource-api'
				|| self.items_source === 'server-api' || self.items_source === 'view-api' || self.items_source === 'crud-api' )
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
						
						// ITERATE ON ONE FIELD RECORDS
						if (self.items_iterator === 'field_editor')
						{
							self.step(context, 'iterator is field_editor');
							
							var types = ['object'];
							
							deferred.resolve(types);
							return types_promise;
						}
						
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
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-10-15',
			'updated':'2015-01-13',
			'description':'Mixin methods for datas model search.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinDatasoureClass = new DevaptClass('DevaptMixinDatasoure', null, class_settings);
	
	
	// METHODS
	DevaptMixinDatasoureClass.infos.ctor = DevaptMixinDatasoure.init_data_source;
	DevaptMixinDatasoureClass.add_public_method('init_data_source_options', {}, DevaptMixinDatasoure.init_data_source_options);
	DevaptMixinDatasoureClass.add_public_method('get_items_array', {}, DevaptMixinDatasoure.get_items_array);
	DevaptMixinDatasoureClass.add_public_method('get_items_types_array', {}, DevaptMixinDatasoure.get_items_types_array);
	
	
	// PROPERTIES
	DevaptMixinDatasoureClass.add_public_bool_property('mixin_trace_datasource',	'',	false, false, false, []);
	
	DevaptMixinDatasoureClass.add_public_obj_property('items_model_obj',		'',	null, false, false, ['model']);
	DevaptMixinDatasoureClass.add_public_str_property('items_model_name',		'', null, true, false, ['model_name']);
	
	DevaptMixinDatasoureClass.add_public_bool_property('items_autoload',		'',	true, false, false, ['view_items_autoload']);
	DevaptMixinDatasoureClass.add_public_str_property('items_source',			'', 'inline', false, false, ['view_items_source']); // inline / model / events / resources
	DevaptMixinDatasoureClass.add_public_str_property('items_source_format',	'',	'array', false, false, ['view_items_source_format']); // json / array

	DevaptMixinDatasoureClass.add_public_bool_property('items_distinct',		'',	false, false, false, []); // items are distinct ?
	DevaptMixinDatasoureClass.add_public_str_property('items_distinct_field',	'',	null, false, false, []); // items are distinct with given field name
	DevaptMixinDatasoureClass.add_public_str_property('items_iterator',			'', 'records', false, false, []); // items iterator : records / fields
	DevaptMixinDatasoureClass.add_public_array_property('items_fields',			'', [], false, false, [], 'string', ','); // item fields
	
	DevaptMixinDatasoureClass.add_public_str_property('items_format',			'', null, false, false, []); // item format
	DevaptMixinDatasoureClass.add_public_array_property('items_formats',		'', null, false, false, [], 'string', ','); // item format
	
	DevaptMixinDatasoureClass.add_public_obj_property('items_current_record',	'', null, false, false, []);
	DevaptMixinDatasoureClass.add_public_obj_property('items_refresh',			'', null, false, false, []);
	
	DevaptMixinDatasoureClass.add_public_array_property('items_records',		'',	[], false, false, [], 'object', ','); // items records
	DevaptMixinDatasoureClass.add_public_int_property('items_records_count',	'',	0, false, false, []); // items records count
	
	DevaptMixinDatasoureClass.add_public_array_property('items_inline',			'',	[], false, false, [], 'string', ',');
	DevaptMixinDatasoureClass.add_public_array_property('items_options',		'',	[], false, false, [], 'string', ',');
	
	DevaptMixinDatasoureClass.add_public_array_property('items_labels',			'',	[], false, false, [], 'string', ',');
	DevaptMixinDatasoureClass.add_public_array_property('items_types',			'',	['view'], false, false, ['view_items_types'], 'string', ',');
		// array of: view / html / callback / object (json) / record
	
	// DevaptMixinDatasoureClass.add_public_array_property('items_records_fields_names',	'',	[], false, false, ['view_items_records_fields'], 'string', ',');
	// DevaptMixinDatasoureClass.add_public_array_property('items_records_fields_types',	'',	[], false, false, ['view_items_records_types'], 'string', ',');
	
	
	// MIXINS
	DevaptMixinDatasoureClass.add_public_mixin(DevaptMixinDatasoureInline);
	DevaptMixinDatasoureClass.add_public_mixin(DevaptMixinDatasoureEvents);
	DevaptMixinDatasoureClass.add_public_mixin(DevaptMixinDatasoureClasses);
	DevaptMixinDatasoureClass.add_public_mixin(DevaptMixinDatasoureResources);
	DevaptMixinDatasoureClass.add_public_mixin(DevaptMixinDatasoureLogs);
	DevaptMixinDatasoureClass.add_public_mixin(DevaptMixinDatasoureModel);
	DevaptMixinDatasoureClass.add_public_mixin(DevaptMixinDatasoureServerApi);
	
	
	// BUILD CLASS
	DevaptMixinDatasoureClass.build_class();
	
	
	
	return DevaptMixinDatasoureClass;
}
);