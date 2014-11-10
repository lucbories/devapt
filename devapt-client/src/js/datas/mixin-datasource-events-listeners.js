/**
 * @file        datas/mixin-datasource-events-listeners.js
 * @desc        Mixin for events listeners data source
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/events'],
function(Devapt, DevaptTypes, DevaptEvents)
{
	/**
	 * @mixin				DevaptMixinDatasoureEventsListeners
	 * @public
	 * @desc				Mixin for events listeners data source
	 */
	var DevaptMixinDatasoureEventsListeners = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureEventsListeners
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
		 * @memberof			DevaptMixinDatasoureEventsListeners
		 * @desc				Get items array for events data source
		 * @return {promise}
		 */
		get_items_array_events: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_events()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
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
			
			// BAD SOURCE SOURCE
			deferred.reject();
			
			
			self.leave(context, self.msg_failure);
			self.pop_trace();
			return items_promise;
		}
	};
	
	
	return DevaptMixinDatasoureEventsListeners;
}
);