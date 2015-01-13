/**
 * @file        datas/mixin-datasource-events.js
 * @desc        Mixin for events data source
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class', 'core/events'],
function(Devapt, DevaptTypes, DevaptClass, DevaptEvents)
{
	/**
	 * @mixin				DevaptMixinDatasoureEvents
	 * @public
	 * @desc				Mixin for events data source
	 */
	var DevaptMixinDatasoureEvents = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureEvents
		 * @desc				Init events data source
		 * @return {nothing}
		 */
		init_data_source_events: function(self)
		{
			// var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_events()';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureEvents
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
				var events_array = DevaptEvents.get_events_array();
				for( ; event_index < events_array.length ; event_index++)
				{
					var event = events_array[event_index];
					if (event.emitter_object.name == self.name)
					{
						continue;
					}
					var record = {};
					record['name']				= event.name;
					record['ts']				= event.fired_ts;
					record['emitter_name']		= event.emitter_object.name;
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
				
				self.items_records = events_array;
				self.items_records_count = events_array.length;
				
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
			'description':'Mixin methods for events datas source.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinDatasoureEventsClass = new DevaptClass('DevaptMixinDatasoureEvents', null, class_settings);
	
	// METHODS
	// DevaptMixinDatasoureEventsClass.infos.ctor = DevaptMixinDatasoureEvents.init_data_source_events;
	DevaptMixinDatasoureEventsClass.add_public_method('init_data_source_events', {}, DevaptMixinDatasoureEvents.init_data_source_events);
	DevaptMixinDatasoureEventsClass.add_public_method('get_items_array_events', {}, DevaptMixinDatasoureEvents.get_items_array_events);
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinDatasoureEventsClass.build_class();
	
	
	return DevaptMixinDatasoureEventsClass;
}
);