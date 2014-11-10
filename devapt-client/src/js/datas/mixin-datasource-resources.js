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
['Devapt', 'core/types', 'core/resources'],
function(Devapt, DevaptTypes, DevaptResources)
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
		init_data_source_resources: function()
		{
			var self = this;
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
			
			// BAD SOURCE SOURCE
			deferred.reject();
			
			
			self.leave(context, self.msg_failure);
			self.pop_trace();
			return items_promise;
		}
	};
	
	
	return DevaptMixinDatasoureResources;
}
);