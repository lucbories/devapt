/**
 * @file        datas/mixin-datasource-classes.js
 * @desc        Mixin for classes data source
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/classes'],
function(Devapt, DevaptTypes, DevaptClasses)
{
	/**
	 * @mixin				DevaptMixinDatasoureClasses
	 * @public
	 * @desc				Mixin for classes data source
	 */
	var DevaptMixinDatasoureClasses = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureClasses
		 * @desc				Init classes data source
		 * @return {nothing}
		 */
		init_data_source_classes: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_classes()';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureClasses
		 * @desc				Get items array for classes data source
		 * @return {promise}
		 */
		get_items_array_classes: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_classes()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
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
			
			// BAD SOURCE SOURCE
			deferred.reject();
			
			
			self.leave(context, self.msg_failure);
			self.pop_trace();
			return items_promise;
		}
	};
	
	
	return DevaptMixinDatasoureClasses;
}
);