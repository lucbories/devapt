/**
 * @file        views/mixin-bind.js
 * @desc        Mixin for bind feature
 * @see			DevaptView
 * @ingroup     DEVAPT_CORE
 * @date        2014-08-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/options', 'core/resources'],
function(Devapt, DevaptTypes, DevaptOptions, DevaptResources)
{
	/**
	 * @mixin				DevaptMixinBind
	 * @public
	 * @desc				Mixin of template methods
	 */
	var DevaptMixinBind = 
	{
		/**
		 * @memberof			DevaptMixinBind
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_bind_trace: false,
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinBind
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_bind_trace);
			var context = 'mixin_init()';
			self.enter(context, '');
			
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinBind
		 * @desc					Bind two items of two objects
		 * @param {string}			arg_events		events filter for the binding (string|arr of strings)
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_set_1		items set name of object 1 (records, recort, filters)
		 * @param {string}			arg_item_1		item name of object 1
		 * @param {object|string}	arg_object_2	object 2
		 * @param {string}			arg_set_2		items set name of object 2 (records, recort, filters)
		 * @param {string}			arg_item_2		item name of object 2
		 * @return {nothing}
		 */
		bind: function(arg_events_filter, arg_bind_action, arg_set_1, arg_item_1, arg_object_2, arg_set_2, arg_item_2)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_bind_trace);
			var context = 'bind(events,action,set,item,obj,set,item)';
			self.enter(context, '');
			
			
			// GET EVENTS FILTER
			var events_filters = [];
			if ( DevaptTypes.is_string(arg_events_filter) )
			{
				var arg_events_filter = arg_events_filter.split(',');
			}
			if ( DevaptTypes.is_array(arg_events_filter) )
			{
				 if ( arg_events_filter.every(DevaptTypes.is_string) )
				 {
					events_filters = arg_events_filter;
				 }
			}
			
			// GET OBJECT 2
			if ( DevaptTypes.is_string(arg_object_2) )
			{
				var promise = DevaptResources.get_resource_instance(arg_object_2);
				promise.done(
					function(obj2)
					{
						self.bind(arg_events_filter, arg_bind_action, arg_set_1, arg_item_1, obj2, arg_set_2, arg_item_2);
					}
				);
				
				self.leave(context, 'async');
				self.pop_trace();
				return;
			}
			
			// LOOP ON EVENTS
			for(events_filter_index in events_filters)
			{
				var events_filter = events_filters[events_filter_index];
				self.value(context, 'events_filter', events_filter);
				
				var cb = function(event_obj, source_obj, source_index, source_value)
					{
						console.log('bind.cb');
						var operands = [source_obj, source_index, source_value];
						arg_object_2.on_binding(event_obj, arg_bind_action, arg_set_2, arg_item_2, operands);
					};
				var has_unique_cb = false;
				self.add_event_callback(events_filter, cb, has_unique_cb);
			}
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinBind
		 * @desc					Do bind actions
		 * @param {object}			arg_event_obj	event object
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_set_2		items set name of object 2 (records, record, filters)
		 * @param {string}			arg_item_2		item name of object 2
		 * @param {array}			arg_event_opds	event operands
		 * @return {nothing}
		 */
		on_binding: function(arg_event_obj, arg_bind_action, arg_set_2, arg_item_2, arg_event_opds)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_bind_trace);
			var context = 'on_bindings(event,action,set,item,opds)';
			self.enter(context, '');
			
			
			switch(arg_set_2)
			{
				case 'filters':
				{
					self.on_binding_on_filters(arg_event_obj, arg_bind_action, arg_item_2, arg_event_opds);
					break;
				}
				case 'records':
				{
					self.on_binding_on_records(arg_event_obj, arg_bind_action, arg_item_2, arg_event_opds);
					break;
				}
				case 'record':
				{
					self.on_binding_on_record(arg_event_obj, arg_bind_action, arg_item_2, arg_event_opds);
					break;
				}
			}
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinBind
		 * @desc					Do bind actions on filters
		 * @param {object}			arg_event_obj	event object
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_item_2		item name of object 2
		 * @param {array}			arg_event_opds	event operands
		 * @return {nothing}
		 */
		on_binding_on_filters: function(arg_event_obj, arg_bind_action, arg_item_2, arg_event_opds)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_bind_trace);
			var context = 'on_binding_on_filters(event,actio,item,opds)';
			self.enter(context, '');
			
			
			console.log(self.name + ': action[' + arg_bind_action + '] on filters for field [' + arg_item_2 + '] with opds count [' + arg_event_opds.length + ']');
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinBind
		 * @desc					Do bind actions on records
		 * @param {object}			arg_event_obj	event object
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_item_2		item name of object 2
		 * @param {array}			arg_event_opds	event operands
		 * @return {nothing}
		 */
		on_binding_on_records: function(arg_event_obj, arg_bind_action, arg_item_2, arg_event_opds)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_bind_trace);
			var context = 'on_binding_on_records(event,actio,item,opds)';
			self.enter(context, '');
			
			
			console.log(self.name + ': action[' + arg_bind_action + '] on records for field [' + arg_item_2 + '] with opds count [' + arg_event_opds.length + ']');
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinBind
		 * @desc					Do bind actions on record
		 * @param {object}			arg_event_obj	event object
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_item_2		item name of object 2
		 * @param {array}			arg_event_opds	event operands
		 * @return {nothing}
		 */
		on_binding_on_record: function(arg_event_obj, arg_bind_action, arg_item_2, arg_event_opds)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_bind_trace);
			var context = 'on_binding_on_record(event,actio,item,opds)';
			self.enter(context, '');
			
			
			console.log(self.name + ': action[' + arg_bind_action + '] on record for field [' + arg_item_2 + '] with opds count [' + arg_event_opds.length + ']');
			
			
			self.leave(context, '');
			self.pop_trace();
		}
		
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinBind
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	DevaptMixinBind.register_options = function(arg_prototype)
	{
	};
	
	
	return DevaptMixinBind;
}
);