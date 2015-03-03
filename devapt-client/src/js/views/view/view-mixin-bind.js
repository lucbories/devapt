/**
 * @file        views/view/view-mixin-bind.js
 * @desc        Mixin for bind feature
 * @see			DevaptView
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-08-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict'
define(
['Devapt', 'core/types', 'object/class', 'core/resources'],
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
			for(var link_key in self.links)
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
					self.value(context, 'action', target_action);
					self.value(context, 'source_kindof', source_kindof);
					self.value(context, 'target_kindof', target_kindof);
					
					var promise = DevaptResources.get_resource_instance(target_name);
					promise.then(
						function(target_obj)
						{
							// console.log(context, 'link target object is found [' + target_obj.name + ']');
							self.step(context, 'link target object is found [' + target_obj.name + ']');
							self.value(context, 'action', target_action);
							
							self.bind(source_events, target_action, source_kindof, source_field, target_obj, target_kindof, target_field);
						},
						
						function()
						{
							console.error('link target object is not found [' + target_obj.name + ']');
						}
					);
					
					continue;
				}
				
				// BIND WITH SOURCE=THIS AND TARGET FROM NAMES
				if ( DevaptTypes.is_not_empty_str(target_names) )
				{
					self.step(context, 'link has target names');
					
					target_names = target_names.split(',');
					for(var target_name_key in target_names)
					{
						var target_name = target_names[target_name_key];
						
						self.step(context, 'loop on link target name [' + target_name + ']');
						
						var promise = DevaptResources.get_resource_instance(target_name);
						promise.then(
							function(target_obj)
							{
								self.step(context, 'link target object is found  [' + target_obj.name + ']');
								
								self.bind(source_events, target_action, source_kindof, source_field, target_obj, target_kindof, target_field);
							},
							
							function()
							{
								console.error('link target object is not found [' + target_obj.name + ']');
							}
						);
					}
					
					continue;
				}
				
				// BIND WITH SOURCE FROM NAME AND TARGET=THIS
				if ( DevaptTypes.is_not_empty_str(source_name) )
				{
					self.step(context, 'link has source name');
					
					var promise = DevaptResources.get_resource_instance(source_name);
					promise.then(
						function(source_obj)
						{
							self.step(context, 'link source object is found');
							
							source_obj.bind(source_events, target_action, source_kindof, source_field, self, target_kindof, target_field);
						}
					);
					
					continue;
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
			// console.error(self.name, arguments);
			
			
			self.value(context, 'arg_bind_action', arg_bind_action);
			self.value(context, 'arg_set_1', arg_set_1);
			self.value(context, 'arg_set_2', arg_set_2);
			
			
			// TARGET FORWARDS EVENT
			if ( DevaptTypes.is_object(arg_object_2.links_forwarder) )
			{
				self.step(context, 'link target object is a links forwarder');
				
				for(var forwarder_key in arg_object_2.links_forwarder)
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
							for(var target_name_key in forwarder_target_names)
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
				promise.then(
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
			for(var events_filter_index in events_filters)
			{
				var events_filter = events_filters[events_filter_index];
				self.value(context, 'events_filter', events_filter);
				
				
				var has_unique_cb = false;
				
				var on_event_cb = function(event_obj, source_obj, opd_record)
					{
						// console.log('bind.event.cb');
						// console.log(arg_object_2, 'bind.cb arg_object_2');
						
						var operands = [source_obj, opd_record];
						// console.log(operands, 'bind.cb.operands');
						
						if ( arg_object_2.is_view )
						{
							if ( ! self.is_render_state_rendering() )
							{
								self.step(context, 'view is not rendering');
								
								if ( self.renders_count === 0)
								{
									self.step(context, 'first view rendering');
									setTimeout(
										function()
										{
											arg_object_2.on_binding(event_obj, arg_bind_action, arg_set_1, arg_item_1, arg_set_2, arg_item_2, operands);
										},
										10
									);
								}
								else
								{
									self.step(context, 'view is rendered');
									arg_object_2.on_binding(event_obj, arg_bind_action, arg_set_1, arg_item_1, arg_set_2, arg_item_2, operands);
								}
							}
							else
							{
								setTimeout(
									function()
									{
										self.step(context, 'view is not yet rendered');
										arg_object_2.on_binding(event_obj, arg_bind_action, arg_set_1, arg_item_1, arg_set_2, arg_item_2, operands);
									},
									10
								);
							}
						}
						else
						{
							arg_object_2.on_binding(event_obj, arg_bind_action, arg_set_1, arg_item_1, arg_set_2, arg_item_2, operands);
						}
					};
				self.add_event_callback(events_filter, on_event_cb, has_unique_cb);
				
				
				var on_change_cb = function(event_obj, source_obj, model, record, field_obj, old_value, new_value)
					{
						// console.log('bind.change.cb');
						
						// console.log(self.name, 'on_change_cb:self.name');
						// console.log(record, 'on_change_cb:record');
						// console.log(field_obj, 'on_change_cb:field_obj');
						// console.log(old_value, 'on_change_cb:old_value');
						// console.log(new_value, 'on_change_cb:new_value');
						
						var index = record.container_item_index;
						var type = arg_set_1;
						var node_jqo = self.get_item_node(index);
						
						// console.log('bind.change.cb:step 1');
						if ( DevaptTypes.is_integer(index) && DevaptTypes.is_array(self.items_records) && self.items_records.length > index )
						{
							var record = self.items_records[index];
							if ( DevaptTypes.is_object(record) && DevaptTypes.is_not_empty_str(field_obj.name) && record[field_obj.name] )
							{
								record[field_obj.name] = new_value;
							}
						}
						
						// console.log('bind.change.cb:step 2');
						var deferred = Devapt.defer();
						if ( DevaptTypes.is_object(node_jqo) && (type === 'object' || type === 'record') )
						{
							node_jqo.children().remove();
							self.render_item_object(deferred, node_jqo, record);
						}
					};
				arg_object_2.add_event_callback('devapt.container.updated', on_change_cb, has_unique_cb);
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
				case 'record-selections':
				{
					self.on_binding_on_selections(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds);
					break;
				}
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
		 * @desc					Do bind actions on selectyions
		 * @param {object}			arg_event_obj	event object
		 * @param {string}			arg_bind_action	binding action
		 * @param {string}			arg_item_1		item name of object 1
		 * @param {string}			arg_item_2		item name of object 2
		 * @param {array}			arg_event_opds	event operands
		 * @return {nothing}
		 */
		on_binding_on_selections: function(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinBind.mixin_bind_trace);
			var context = 'on_binding_on_selections(event,actio,item,opds)';
			self.enter(context, '');
			
			
			// console.log(self.name + ': on_binding_on_selections: action[' + arg_bind_action + '] on record for field [' + arg_item_2 + '] with opds count [' + arg_event_opds.length + ']');
			// console.log(arg_event_opds, 'arg_event_opds');
			// console.error(self, 'self');
			// console.log(arg_event_obj, 'arg_event_obj');
			
			self.value(context, 'action', arg_bind_action);
			switch(arg_bind_action)
			{
				/*case 'toggle':
				{
					// GET EVENT OPERANDS MAP
					var event_opds_map = arg_event_opds[1];
					
					// GET RECORD
					var record = event_opds_map['record'];
					if (! record && DevaptTypes.is_integer( arg_event_opds[1] ) )
					{
						var record_index = arg_event_opds[1];
						record = self.items_records[record_index];
					}
					console.log(record, 'record');
					
					// GET FIELD VALUE
					var field_name = arg_item_1;
					var field_value = event_opds_map['field_value'] ? event_opds_map['field_value'] : record[arg_item_1];
					if ( DevaptTypes.is_null(field_value) )
					{
						if ( DevaptTypes.is_not_empty_array(self.items_records) )
						{
							for(var record_index in self.items_records)
							{
								var items_record = self.items_records[record_index];
								field_value = items_record[arg_item_1];
								break;
							}
						}
						
						if ( DevaptTypes.is_null(field_value) )
						{
							self.value(context, 'field name', field_name);
							self.error(context, 'bad field value');
							self.leave(context, '');
							self.pop_trace();
							return;
						}
					}
					
					// ON RECORD SELECT
					self.on_record_select(field_name, field_value, null);
					
					// SET CURRENT RECORD
					self.items_current_records = record;
					
					// RENDER VIEW
					
					break;
				}*/
				case 'set':
				{
					self.step(context, 'action is set');
					
					// GET EVENT OPERANDS MAP
					var event_opds_map = arg_event_opds[1];
					
					// GET RECORD
					var record = event_opds_map['record'];
					if (! record && DevaptTypes.is_integer( arg_event_opds[1] ) )
					{
						self.step(context, 'get record by index');
						
						var record_index = arg_event_opds[1];
						record = self.items_records[record_index];
					}
					// console.log(record, 'record');
					
					// GET FIELD VALUE
					self.step(context, 'get field value');
					var field_name = arg_item_1;
					var field_value = event_opds_map['field_value'] ? event_opds_map['field_value'] : record[field_name];
					if ( DevaptTypes.is_null(field_value) )
					{
						self.step(context, 'field value is null');
						
						if ( DevaptTypes.is_not_empty_array(self.items_records) )
						{
							self.step(context, 'items records is a valid array');
							
							for(var record_index in self.items_records)
							{
								self.value(context, 'record_index', record_index);
								
								var items_record = self.items_records[record_index];
								field_value = items_record[field_name];
								break;
							}
						}
						
						// console.log(record, 'record');
						if ( DevaptTypes.is_null(field_value) )
						{
							self.value(context, 'field name', field_name);
							self.error(context, 'bad field value');
							self.leave(context, '');
							self.pop_trace();
							return;
						}
					}
					
					// ON RECORD SELECT
					self.step(context, 'on record select');
					self.on_record_select(arg_item_2, field_value, null, false);
					
					// SET CURRENT RECORD
					self.step(context, 'set current record');
					self.items_current_records = record;
					
					// RENDER VIEW
					
					break;
				}
				
				// case 'toggle':
				// {
					// break;
				// }
				
			/*	case 'add':
				{
					break;
				}
				
				case 'remove':
				{
					break;
				}*/
				
			/*	case 'reset':
				{
					// UNSELECT ALL
					self.remove_items_css_class('selected');
					
					// SET CURRENT RECORD
					self.items_current_records = null;
					
					break;
				}*/
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
			
			self.value(context, 'action', arg_bind_action);
			switch(arg_bind_action)
			{
				case 'update':
				{
					self.step(context, 'action is update');
					
					// GET SOURCE OBJECT
					// var source_object = arg_event_opds[0];
					
					// GET EVENT OPERANDS MAP
					var event_opds_map = arg_event_opds[1];
					// console.log(event_opds_map, 'event_opds_map');
					
					// GET RECORD
					var record = event_opds_map['record'];
					// console.log(record, 'record');
					
					// GET FIELD VALUE
					self.step(context, 'get field value');
					// console.log(event_opds_map, 'event_opds_map');
					// console.log(record, 'record');
					// console.log(arg_item_1, 'arg_item_1');
					// console.log(record[arg_item_1], 'record[arg_item_1]');
					var field_value = event_opds_map['field_value'] ? event_opds_map['field_value'] : record[arg_item_1];
					
					// ADD FILTER
					// console.log(context, 'add field value filter');
					self.step(context, 'add field value filter');
					var filter_added_promise = self.view_model.get('ready_promise').invoke('add_field_value_filter', arg_item_2, field_value, true);
					
					// filter_added_promise.then(
						// function()
						// {
							self.step(context, 'filter is added');
							self.value(context, 'self.renders_count', self.renders_count);
							
							if (self.items_iterator === 'field_editor')
							{
								self.step(context, 'select items in field editor');
								
								self.items_current_record = record;
								
								if ( self.renders_count === 0)
								{
									self.step(context, 'first view rendering');
									
									var render_promise = self.render( Devapt.defer() );
									render_promise.then(
										function()
										{
											self.select([record]);
										}
									);
								}
								else
								{
									self.select([record]);
								}
								
								// self.view_model.get('ready_promise').invoke('select', [record]);
							}
							else if (self.items_iterator === 'fields')
							{
								self.step(context, 'select items in fields');
								
								self.items_current_record = record;
								
								self.remove_items();
								self.render_items( Devapt.defer() );
								
								// self.view_model.get('ready_promise').invoke('select', [record]);
								// self.select([record]);
							}
							else if (self.items_iterator === 'records')
							{
								self.step(context, 'select items in fields');
								
								if ( self.renders_count === 0)
								{
									self.step(context, 'first view rendering');
									
									self.render( Devapt.defer() );
								}
								else
								{
									self.step(context, 'remove previous items and render items');
									
									self.remove_items();
									self.render_items( Devapt.defer() );
								}
							}
							else
							{
								self.step(context, 'bad items iterator [' + self.items_iterator + ']');
							}
						// }
					// );
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
			
			self.value(context, 'action', arg_bind_action);
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
			
			self.value(context, 'action', arg_bind_action);
			switch(arg_bind_action)
			{
				case 'select':
				{
					self.step(context, 'action is select');
					
					var operand_1 = arg_event_opds[1];
					// console.log(operand_1, 'operand_1');
					
					var selected_item_record = operand_1['record'];
					// console.log(selected_item_record, 'selected_item_record');
					
					var source_field_name = arg_item_1;
					var target_field_name = arg_item_2;
					
					var target_field_value = selected_item_record[source_field_name];
					// console.log(target_field_value, 'target_field_value');
					
					self.on_record_select(target_field_name, target_field_value, null);
					break;
				}
				
				default:
				{
					console.log(arg_bind_action, 'event action not processed');
					break;
				}
			}
			
			
			self.leave(context, '');
			self.pop_trace();
		}
		
	};
	
	
	
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
	DevaptMixinBindClass.add_public_method('on_binding_on_selections', {}, DevaptMixinBind.on_binding_on_selections);
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