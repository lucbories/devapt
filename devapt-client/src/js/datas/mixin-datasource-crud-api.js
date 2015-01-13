/**
 * @file        datas/mixin-datasource-crud-api.js
 * @desc        Mixin for CRUD API data source
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2015-01-13
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class', 'core/classes'],
function(Devapt, DevaptTypes, DevaptClass, DevaptClasses)
{
	/**
	 * @mixin				DevaptMixinDatasoureCrudApi
	 * @public
	 * @desc				Mixin for CRUD API data source
	 */
	var DevaptMixinDatasoureCrudApi = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureCrudApi
		 * @desc				Init CRUD API data source
		 * @return {nothing}
		 */
		init_data_source_crud_api: function(self)
		{
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_crud_api()';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureCrudApi
		 * @desc				Get items array for CRUD API data source
		 * @return {promise}
		 */
		get_items_array_crud_api: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_crud_api()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
			// GET ITEMS FROM EVENTS SOURCE
			if ( self.items_source === 'crud-api' )
			{
				var items = [];
				var model_class = DevaptClasses.get_class('DevaptModel');
				if (model_class)
				{
					var model_instances = model_class.instances_array;
					var model_index = 0;
					for( ; model_index < model_instances.length ; model_index++)
					{
						var model = model_instances[model_index];
						var crud_api = model.get_crud_api();
						
						var record_create = {
							model_name:crud_api.model_name,
							action:'create',
							method:crud_api.action_create.method,
							format:crud_api.action_create.format,
							url:crud_api.action_create.url
						};
						var record_read = {
							model_name:crud_api.model_name,
							action:'read',
							method:crud_api.action_read.method,
							format:crud_api.action_read.format,
							url:crud_api.action_read.url
						};
						var record_update = {
							model_name:crud_api.model_name,
							action:'update',
							method:crud_api.action_update.method,
							format:crud_api.action_update.format,
							url:crud_api.action_update.url
						};
						var record_delete = {
							model_name:crud_api.model_name,
							action:'delete',
							method:crud_api.action_delete.method,
							format:crud_api.action_delete.format,
							url:crud_api.action_delete.url
						};
						
						items.push(record_create);
						items.push(record_read);
						items.push(record_update);
						items.push(record_delete);
					}
				
					// console.log(items, 'resources.items');
					
					if ( self.items_source_format === 'json' )
					{
						var json_str = items.join(',');
						var json_obj = $.parseJSON(json_str);
						
						// console.log(json_obj, 'resources.json_obj');
						
						items = json_obj;
					}
					
					self.items_records = items;
					self.items_records_count = items.length;
					
					deferred.resolve(items);
					
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
			'created':'2015-01-13',
			'updated':'2015-01-13',
			'description':'Mixin methods for CRUD API datas source.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinDatasoureCrudApiClass = new DevaptClass('DevaptMixinDatasoureCrudApi', null, class_settings);
	
	// METHODS
	DevaptMixinDatasoureCrudApiClass.add_public_method('init_data_source_crud_api', {}, DevaptMixinDatasoureCrudApi.init_data_source_crud_api);
	DevaptMixinDatasoureCrudApiClass.add_public_method('get_items_array_crud_api', {}, DevaptMixinDatasoureCrudApi.get_items_array_crud_api);
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinDatasoureCrudApiClass.build_class();
	
	
	return DevaptMixinDatasoureCrudApiClass;
}
);