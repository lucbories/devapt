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
['Devapt', 'core/types', 'core/class', 'core/resources'],
function(Devapt, DevaptTypes, DevaptClass, DevaptResources)
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
		mixin_init_bind: function(self)
		{		
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'mixin_init_bind()';
			self.enter(context, '');
			
			
			// DEBUG
			// console.log(self.name, 'mixin_init_bind: self.name');
			// console.log(self, 'self');
			// console.log(self.links, 'self.links');
			
			
			// TEST IF A LINKS OPTION IS SET
			if ( ! DevaptTypes.is_object(self.links) )
			{
				self.leave(context, 'no links');
				self.pop_trace();
				return;
			}
			
			/*
				EXAMPLE:
					....links.selectlink.source.name=view_access_users_list
					....links.selectlink.source.event=devapt.events.container.selected
					....links.selectlink.source.kindof=record
					....links.selectlink.source.field=login
					....links.selectlink.target.kindof=filters
					....links.selectlink.target.field=login
			*/
			// LOOP ON LINKS
			for(link_key in self.links)
			{
				self.value(context, 'link_key', link_key);
				
				// GET LINK SETTINGS
				var link_settings = self.links[link_key];
				// console.log(link_settings, 'link_settings');
				
				// GET LINKS ATTRIBUTES
				var source = link_settings['source'];
				if ( ! DevaptTypes.is_object(source) )
				{
					self.step(context, 'bad source object');
					continue;
				}
				var target = link_settings['target'];
				if ( ! DevaptTypes.is_object(target) )
				{
					self.step(context, 'bad target object');
					continue;
				}
				var source_name = source['name'];
				var source_events = source['event'];
				var source_kindof = source['kindof'];
				var source_field = source['field'];
				var target_name = target['name'];
				var target_names = target['names'];
				var target_action = target['action'];
				var target_kindof = target['kindof'];
				var target_field = target['field'];
				
				// BIND WITH SOURCE=THIS AND TARGET FROM NAME
				if ( DevaptTypes.is_not_empty_str(target_name) )
				{
					self.step(context, 'link has target name [' + target_name + ']');
					
					var promise = DevaptResources.get_resource_instance(target_name);
					promise.done(
						function(target_obj)
						{
							self.step(context, 'link target object is found [' + target_obj.name + ']');
							self.bind(source_events, target_action, source_kindof, source_field, target_obj, target_kindof, target_field);
						}
					);
					
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return;
				}
				
				// BIND WITH SOURCE=THIS AND TARGET FROM NAMES
				if ( DevaptTypes.is_not_empty_str(target_names) )
				{
					self.step(context, 'link has target names');
					
					target_names = target_names.split(',');
					for(target_name_key in target_names)
					{
						var target_name = target_names[target_name_key];
						
						self.step(context, 'loop on link target name [' + target_name + ']');
						
						var promise = DevaptResources.get_resource_instance(target_name);
						promise.done(
							function(target_obj)
							{
								self.step(context, 'link target object is found  [' + target_obj.name + ']');
								self.bind(source_events, target_action, source_kindof, source_field, target_obj, target_kindof, target_field);
							}
						);
					}
					
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return;
				}
				
				// BIND WITH SOURCE FROM NAME AND TARGET=THIS
				if ( DevaptTypes.is_not_empty_str(source_name) )
				{
					self.step(context, 'link has source name');
					
					var promise = DevaptResources.get_resource_instance(source_name);
					promise.done(
						function(source_obj)
						{
							self.step(context, 'link source object is found');
							source_obj.bind(source_events, target_action, source_kindof, source_field, self, target_kindof, target_field);
						}
					);
					
					self.leave(context, self.msg_success_promise);
					self.pop_trace();
					return;
				}
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinBind
		 * @desc					Bind two items of two objects
		 * @param {string}			arg_events		events filter for the binding (string|arr of strings)
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_set_1		items set name of object 1 (records, record, filters)
		 * @param {string}			arg_item_1		item name of object 1
		 * @param {object|string}	arg_object_2	object 2
		 * @param {string}			arg_set_2		items set name of object 2 (records, record, filters)
		 * @param {string}			arg_item_2		item name of object 2
		 * @return {nothing}
		 */
		bind: function(arg_events_filter, arg_bind_action, arg_set_1, arg_item_1, arg_object_2, arg_set_2, arg_item_2)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'bind(events,action,set,item,obj,set,item)';
			self.enter(context, '');
			
			
			// TARGET FORWARDS EVENT
			if ( DevaptTypes.is_object(arg_object_2.links_forwarder) )
			{
				self.step(context, 'link target object is a links forwarder');
				
				for(forwarder_key in arg_object_2.links_forwarder)
				{
					self.step(context, 'loop on target object link forward');
					
					var forwarder_obj = arg_object_2.links_forwarder[forwarder_key];
					var forwarder_source_name = forwarder_obj.source.name;
					var forwarder_target_names = forwarder_obj.target.name || forwarder_obj.target.names;
					if ( DevaptTypes.is_string(forwarder_source_name) && DevaptTypes.is_string(forwarder_target_names) )
					{
						self.step(context, 'target object link forward has valid source name and target names');
						
						// CHECK SOURCE NAME
						if ( ! DevaptTypes.is_not_empty_str(forwarder_source_name) )
						{
							self.step(context, 'source name is not a valid string');
							self.value(context, 'forwarder_source_name', forwarder_source_name);
							
							self.leave(context, self.msg_failure);
							self.pop_trace();
							return;
						}
						
						// CHECK TARGET NAMES
						if ( DevaptTypes.is_not_empty_str(forwarder_target_names) )
						{
							forwarder_target_names = forwarder_target_names.split(',');
						}
						if ( ! DevaptTypes.is_array(forwarder_target_names) )
						{
							self.step(context, 'target names is not an array');
							self.value(context, 'forwarder_target_names', forwarder_target_names);
							
							self.leave(context, self.msg_failure);
							self.pop_trace();
							return;
						}
						
						// TEST SOURCE
						if (self.name === forwarder_source_name || forwarder_source_name === '*')
						{
							self.step(context, 'target object bind because link self.name === target object link forward source name');
							
							// LOOP ON TARGETS NAMES
							for(target_name_key in forwarder_target_names)
							{
								var target_name = forwarder_target_names[target_name_key];
								
								self.step(context, 'loop on link target name [' + target_name + ']');
								
								self.bind(arg_events_filter, arg_bind_action, arg_set_1, arg_item_1, target_name, arg_set_2, arg_item_2);
							}
							
							self.leave(context, self.msg_success);
							self.pop_trace();
							return;
						}
					}
				}
			}
			
			
			self.step(context, 'default self bind');
			
			
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
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return;
			}
			
			// LOOP ON EVENTS
			for(events_filter_index in events_filters)
			{
				var events_filter = events_filters[events_filter_index];
				self.value(context, 'events_filter', events_filter);
				
				var cb = function(event_obj, source_obj, opd_record)
					{
						// console.log('bind.cb');
						// console.log(arg_object_2, 'bind.cb arg_object_2');
						var operands = [source_obj, opd_record];
						// console.log(operands, 'bind.cb.operands');
						arg_object_2.on_binding(event_obj, arg_bind_action, arg_set_1, arg_item_1, arg_set_2, arg_item_2, operands);
					};
				var has_unique_cb = false;
				self.add_event_callback(events_filter, cb, has_unique_cb);
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinBind
		 * @desc					Do bind actions
		 * @param {object}			arg_event_obj	event object
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_set_1		items set name of object 1 (records, record, filters)
		 * @param {string}			arg_item_1		item name of object 1
		 * @param {string}			arg_set_2		items set name of object 2 (records, record, filters)
		 * @param {string}			arg_item_2		item name of object 2
		 * @param {array}			arg_event_opds	event operands
		 * @return {nothing}
		 */
		on_binding: function(arg_event_obj, arg_bind_action, arg_set_1, arg_item_1, arg_set_2, arg_item_2, arg_event_opds)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'on_bindings(event,action,set,item,opds)';
			self.enter(context, '');
			
			
			// DEBUG
			// console.info(self, 'self');
			// console.log(arg_event_obj, 'arg_event_obj');
			
			
			switch(arg_set_1 + '-' + arg_set_2)
			{
				case 'record-filters':
				{
					self.on_binding_on_filters(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds);
					break;
				}
				case 'records-records':
				{
					self.on_binding_on_records(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds);
					break;
				}
				case 'record-record':
				{
					self.on_binding_on_record(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds);
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
		 * @param {string}			arg_item_1		item name of object 1
		 * @param {string}			arg_item_2		item name of object 2
		 * @param {array}			arg_event_opds	event operands
		 * @return {nothing}
		 */
		on_binding_on_filters: function(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'on_binding_on_filters(event,actio,item,opds)';
			self.enter(context, '');
			
			
			// console.log(self.name + ': on_binding_on_filters: action[' + arg_bind_action + '] on record for field [' + arg_item_2 + '] with opds count [' + arg_event_opds.length + ']');
			// console.log(arg_event_opds, 'arg_event_opds');
			
			switch(arg_bind_action)
			{
				case 'update':
				{
					// GET EVENT OPERANDS MAP
					var event_opds_map = arg_event_opds[1];
					
					// GET RECORD
					var record = event_opds_map['record'];
					// console.log(record, 'record');
					
					// GET FIELD VALUE
					var field_value = event_opds_map['field_value'] ? event_opds_map['field_value'] : record[arg_item_1];
					
					// ADD FILTER
					self.add_field_value_filter(null, arg_item_2, field_value, true);
					
					// SET CURRENT RECORD
					self.items_current_record = record;
					
					// RENDER VIEW
					if ( ! self.is_rendering )
					{
						var deferred = $.Deferred();
						if ( self.renders_count === 0)
						{
							self.render(deferred);
						}
						else
						{
							self.remove_items();
							self.render_items(deferred);
						}
					}
				}
			}
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinBind
		 * @desc					Do bind actions on records
		 * @param {object}			arg_event_obj	event object
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_item_1		item name of object 1
		 * @param {string}			arg_item_2		item name of object 2
		 * @param {array}			arg_event_opds	event operands
		 * @return {nothing}
		 */
		on_binding_on_records: function(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'on_binding_on_records(event,actio,item,opds)';
			self.enter(context, '');
			
			
			// console.log(self.name + ': on_binding_on_records: action[' + arg_bind_action + '] on records for field [' + arg_item_2 + '] with opds count [' + arg_event_opds.length + ']');
			// console.log(arg_event_opds, 'arg_event_opds');
			
			switch(arg_bind_action)
			{
				// case 'select': {
					// console.log(arg_bind_action, 'event action not processed');
				// }
				
				default: {
					console.error(arg_bind_action, 'event action not processed');
				}
			}
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinBind
		 * @desc					Do bind actions on record
		 * @param {object}			arg_event_obj	event object
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_item_1		item name of object 1
		 * @param {string}			arg_item_2		item name of object 2
		 * @param {array}			arg_event_opds	event operands
		 * @return {nothing}
		 */
		on_binding_on_record: function(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'on_binding_on_record(event,actio,item,opds)';
			self.enter(context, '');
			
			
			// console.log(self.name + ': on_binding_on_record: action[' + arg_bind_action + '] on record for field [' + arg_item_2 + '] with opds count [' + arg_event_opds.length + ']');
			// console.log(arg_event_opds, 'arg_event_opds');
			
			switch(arg_bind_action)
			{
				case 'select':
				{
					var operand_1 = arg_event_opds[1];
					// console.log(operand_1, 'operand_1');
					
					var selected_item_record = operand_1['record'];
					// console.log(selected_item_record, 'selected_item_record');
					
					var source_field_name = arg_item_1;
					var target_field_name = arg_item_2;
					
					var target_field_value = selected_item_record[source_field_name];
					// console.log(target_field_value, 'target_field_value');
					
					switch(arg_bind_action)
					{
						case 'select': {
							self.on_record_select(target_field_name, target_field_value, null);
							break;
						}
						
						default: {
							console.log(arg_bind_action, 'event action not processed');
							break;
						}
					}
				}
			}
			
			
			self.leave(context, '');
			self.pop_trace();
		}
		
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinBind
	 * @desc				Register mixin options
	 * @param {object}		arg_prototype
	 * @return {nothing}
	 */
/*	DevaptMixinBind.register_options = function(arg_prototype)
	{
		DevaptOptions.register_obj_option(arg_prototype, 'links', null, false, []);
		DevaptOptions.register_obj_option(arg_prototype, 'links_forwarder', null, false, []);
	};*/
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-14',
			'updated':'2014-12-06',
			'description':'Mixin methods for bind feature.'
		}
	};
	var DevaptMixinBindClass = new DevaptClass('DevaptMixinBind', null, class_settings);
	
	// METHODS
	DevaptMixinBindClass.infos.ctor = DevaptMixinBind.mixin_init_bind;
	DevaptMixinBindClass.add_public_method('bind', {}, DevaptMixinBind.bind);
	DevaptMixinBindClass.add_public_method('on_binding', {}, DevaptMixinBind.on_binding);
	DevaptMixinBindClass.add_public_method('on_binding_on_filters', {}, DevaptMixinBind.on_binding_on_filters);
	DevaptMixinBindClass.add_public_method('on_binding_on_records', {}, DevaptMixinBind.on_binding_on_records);
	DevaptMixinBindClass.add_public_method('on_binding_on_record', {}, DevaptMixinBind.on_binding_on_record);
	
	// PROPERTIES
	// DevaptMixinBindClass.add_public_bool_property('mixin_bind_trace',		'', false, false, false, []);
	DevaptMixinBindClass.add_public_object_property('links',				'', null, false, false, []);
	DevaptMixinBindClass.add_public_object_property('links_forwarder',		'', null, false, false, []);
	
	// BUID MIXIN CLASS
	DevaptMixinBindClass.build_class();
	
	
	return DevaptMixinBindClass;
}
);