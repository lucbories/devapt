/**
 * @file        datas/mixin-datasource-resources.js
 * @desc        Mixin for resources data source
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-02
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
	 * @mixin				DevaptMixinDatasoureResources
	 * @public
	 * @desc				Mixin for resources data source
	 */
	var DevaptMixinDatasoureResources = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureResources
		 * @desc				Init resources data source
		 * @return {nothing}
		 */
		init_data_source_resources: function(self)
		{
			// var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_resources()';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureResources
		 * @desc				Get items array for resources data source
		 * @return {promise}
		 */
		get_items_array_resources: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_resources()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
			// GET ITEMS FROM EVENTS SOURCE
			if ( self.items_source === 'resources' )
			{
				var items = [];
				var resource_index = self.items_last_index ? self.items_last_index : 0;
				var resources_instances = DevaptClasses.get_instances_array();
				for( ; resource_index < resources_instances.length ; resource_index++)
				{
					var resource = resources_instances[resource_index];
					var record = {};
					record['name']				= resource.name;
					record['class_name']		= resource.class_name;
					record['trace']				= resource.trace ? 'true' : 'false';
					items.push(record);
				}
				self.items_last_index = resource_index;
				
				// console.log(items, 'resources.items');
				
				if ( self.items_source_format === 'json' )
				{
					var json_str = items.join(',');
					var json_obj = $.parseJSON(json_str);
					
					// console.log(json_obj, 'resources.json_obj');
					
					items = json_obj;
				}
				
				self.items_records = resources_instances;
				self.items_records_count = resources_instances.length;
				
				deferred.resolve(items);
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return items_promise;
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
			'description':'Mixin methods for resources datas source.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinDatasoureResourcesClass = new DevaptClass('DevaptMixinDatasoureResources', null, class_settings);
	
	// METHODS
	// DevaptMixinDatasoureResourcesClass.infos.ctor = DevaptMixinDatasoureResources.init_data_source_resources;
	DevaptMixinDatasoureResourcesClass.add_public_method('init_data_source_resources', {}, DevaptMixinDatasoureResources.init_data_source_resources);
	DevaptMixinDatasoureResourcesClass.add_public_method('get_items_array_resources', {}, DevaptMixinDatasoureResources.get_items_array_resources);
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinDatasoureResourcesClass.build_class();
	
	
	return DevaptMixinDatasoureResourcesClass;
}
);