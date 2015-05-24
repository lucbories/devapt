/**
 * @file        datas/mixin-datasource-events-listeners.js
 * @desc        Mixin for events listeners data source
 * @see			...
 * @ingroup     DEVAPT_DATAS
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'object/events'],
function(Devapt, DevaptTypes, DevaptClass, DevaptEvents)
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
		 * @desc				Init events listeners data source
		 * @return {nothing}
		 */
		init_data_source_events_listeners: function(self)
		{
			// var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_events()';
			self.enter(context, '');
			
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureEventsListeners
		 * @desc				Get items array for events listeners data source
		 * @return {promise}
		 */
		get_items_array_events_listeners: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_events()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = Devapt.defer();
			var items_promise = deferred.promise;
			
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
					record['target_name']		= event.emitter_object.name;
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
				
				self.items_records = DevaptEvents.all_events;
				self.items_records_count = DevaptEvents.all_events.length;
				
				deferred.resolve(items);
				
				self.leave(context, Devapt.msg_success_promise);
				self.pop_trace();
				return items_promise;
			}
			
			// BAD SOURCE SOURCE
			deferred.reject();
			
			
			self.leave(context, Devapt.msg_failure);
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
			'description':'Mixin methods for events listeners datas source.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinDatasoureEventsListenersClass = new DevaptClass('DevaptMixinDatasoureEventsListeners', null, class_settings);
	
	// METHODS
	// DevaptMixinDatasoureEventsListenersClass.infos.ctor = DevaptMixinDatasoureEventsListeners.init_data_source_events_listeners;
	DevaptMixinDatasoureEventsListenersClass.add_public_method('init_data_source_events_listeners', {}, DevaptMixinDatasoureEventsListeners.init_data_source_events_listeners);
	DevaptMixinDatasoureEventsListenersClass.add_public_method('get_items_array_events_listeners', {}, DevaptMixinDatasoureEventsListeners.get_items_array_events_listeners);
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinDatasoureEventsListenersClass.build_class();
	
	
	return DevaptMixinDatasoureEventsListenersClass;
}
);