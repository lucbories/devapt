/**
 * @file        datas/mixin-datasource-api.js
 * @desc        Mixin for SERVER API data source
 * @see			...
 * @ingroup     DEVAPT_DATAS
 * @date        2015-01-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'object/classes'],
function(Devapt, DevaptTypes, DevaptClass, DevaptClasses)
{
	/**
	 * @mixin				DevaptMixinDatasoureServerApi
	 * @public
	 * @desc				Mixin for SERVER API data source
	 */
	var DevaptMixinDatasoureServerApi = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureServerApi
		 * @desc				Init SERVER API data source
		 * @return {nothing}
		 */
		init_data_source_server_api: function(self)
		{
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_server_api()';
			self.enter(context, '');
			
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureServerApi
		 * @desc				Get items array for SERVER API data source
		 * @return {promise}
		 */
		get_items_array_server_api: function()
		{
			var self = this;
			// self.mixin_trace_datasource = true;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_server_api()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = Devapt.defer();
			var items_promise = Devapt.promise(deferred);
			
			
			// INIT ITEMS
			var items = [];
			
			
			// CRUD API
			self.value(context, 'items source', self.items_source);
			if ( self.items_source === 'server-api' || self.items_source === 'crud-api' )
			{
				self.step(context, 'CRUD API');
				
				var model_instances = DevaptClasses.get_model_instances();
				var model_index = 0;
				for( ; model_index < model_instances.length ; model_index++)
				{
					var model = model_instances[model_index];
					self.value(context, 'loop on model', model.name);
					var server_api = model.get_server_api();
					
					var record_create = {
						resource_name:server_api.model_name,
						action:'create',
						method:server_api.action_create.method,
						format:server_api.action_create.format,
						url:server_api.action_create.url
					};
					var record_read = {
						resource_name:server_api.model_name,
						action:'read',
						method:server_api.action_read.method,
						format:server_api.action_read.format,
						url:server_api.action_read.url
					};
					var record_update = {
						resource_name:server_api.model_name,
						action:'update',
						method:server_api.action_update.method,
						format:server_api.action_update.format,
						url:server_api.action_update.url
					};
					var record_delete = {
						resource_name:server_api.model_name,
						action:'delete',
						method:server_api.action_delete.method,
						format:server_api.action_delete.format,
						url:server_api.action_delete.url
					};
					
					items.push(record_create);
					items.push(record_read);
					items.push(record_update);
					items.push(record_delete);
				}
			}
			
			
			// VIEW API
			if ( self.items_source === 'server-api' || self.items_source === 'view-api' )
			{
				self.step(context, 'VIEW API');
				
				var view_instances = DevaptClasses.get_view_instances();
				var view_index = 0;
				for( ; view_index < view_instances.length ; view_index++)
				{
					var view = view_instances[view_index];
					self.value(context, 'loop on view', view.name);
					
					var server_api = view.get_server_api();
					// console.log(server_api);
					
					// var record_view = {
						// resource_name:server_api.view_name,
						// action:'display_view',
						// method:server_api.action_view.method,
						// format:server_api.action_view.format,
						// url:server_api.action_view.url
					// };
					var record_page = {
						resource_name:server_api.view_name,
						action:'display_page',
						method:server_api.action_page.method,
						format:server_api.action_page.format,
						url:server_api.action_page.url
					};
					
					// items.push(record_view);
					items.push(record_page);
				}
			}
			
			
			// RRSOURCE API
			if ( self.items_source === 'server-api' || self.items_source === 'resource-api' )
			{
				self.step(context, 'RESOURCE API');
				
				var record_resource = {
					resource_name:'resources',
					action:'resource',
					method:'GET',
					format:'devapt_resource_api_2',
					url:'/.../resources/'
				};
				
				items.push(record_resource);
			}
			
			
			// self.mixin_trace_datasource = false;
			
			// BAD ITEMS
			if ( ! DevaptTypes.is_array(items) )
			{
				deferred.reject();
				
				self.leave(context, Devapt.msg_failure);
				self.pop_trace();
				return items_promise;
			}
			
			
			// CONVERT TO JSON
			if ( self.items_source_format === 'json' )
			{
				var json_str = items.join(',');
				var json_obj = $.parseJSON(json_str);
				
				// console.log(json_obj, 'resources.json_obj');
				
				items = json_obj;
			}
			
			
			// REGISTER ITEMS
			// console.log(items);
			self.items_records = items;
			self.items_records_count = items.length;
			
			
			deferred.resolve(items);
			
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
			'created':'2015-01-13',
			'updated':'2015-01-13',
			'description':'Mixin methods for SERVER API datas source.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinDatasoureServerApiClass = new DevaptClass('DevaptMixinDatasoureServerApi', null, class_settings);
	
	// METHODS
	DevaptMixinDatasoureServerApiClass.add_public_method('init_data_source_server_api', {}, DevaptMixinDatasoureServerApi.init_data_source_server_api);
	DevaptMixinDatasoureServerApiClass.add_public_method('get_items_array_server_api', {}, DevaptMixinDatasoureServerApi.get_items_array_server_api);
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinDatasoureServerApiClass.build_class();
	
	
	return DevaptMixinDatasoureServerApiClass;
}
);