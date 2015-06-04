/**
 * @file        views/container-mixin-filtered.js
 * @desc        Mixin for datas filtered feature for containers
 * 				API
 * 					SETTINGS
 * 						filtered.enabled: filter processing is enabled ? (boolean)
 * 						filtered.event: event name to run filtering processing when received(string)
 * 						filtered.case_sensitive: filtered value is case sensitive ? (boolean)
 * 						filtered.fields: list of coma separated fields names to look up filtered value (string)
 * 						filtered.source: event emitter name (string)
 * 						
 * 					ATTRIBUTES
 * 						mixin_trace_filtered: mixin trace flag (boolean)
 * 						mixin_filtered_enabled: all filters processing are enabled ? (boolean)
 * 						
 * 					METHODS
 * 						mixin_init_filtered(self): mixin constructor, register events handle (nothing)
 * 						on_filtered_event(arg_event_operands): handle an event and call apply_filtered_value (nothing)
 * 						apply_filtered_value(arg_filtered_value, arg_fields_names): test all nodes and apply a filter (boolean)
 * 						
 * 					PRINCIPLE
 * 						An input view V1 fire an event E1 when its value changed.
 * 						A container view V2 apply the filter value of V1 when E1 is fired.
 * 						V2 has fields: F1, F2, F3, F4
 * 						
 * 						V2.filtered.enabled=true
 * 						V2.filtered.event='devapt.input.changed'
 * 						V2.filtered.case_sensitive=false
 * 						V2.filtered.fields=F2,F3
 * 						V2.filtered.source=V1
 * 						
 * 						Mixin constructor declares:
 * 							V1.add_event_listener('devapt.input.changed', [V2, V2.on_filtered_event], false)
 * 							
 * 						If V2 has a pagination linked view V3, V2 call apply_filtered_value when pagination apply_pagination is run.
 * 						
 * 						If V2 is refreshed, V2 runs apply_pagination after items rendering and so call apply_filtered_value.
 * 						But if an input is changed during a refresh step, two call of apply_filtered_value are run.
 * 						That's why we have a lock to prevent many simultaneous runs.
 * 						An event handling run is delay to wait for the previous run.
 * 						
 * @see			DevaptContainer
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-08-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'core/resources'],
function(Devapt, DevaptTypes, DevaptClass, DevaptResources)
{
	/**
	 * @mixin				DevaptMixinFiltered
	 * @public
	 * @desc				Mixin of methods for datas filtered features
	 */
	var DevaptMixinFiltered = 
	{
		/**
		 * @memberof			DevaptMixinFiltered
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_filtered: true,
		
		
		
		/**
		 * @memberof			DevaptMixinFiltered
		 * @public
		 * @desc				Enable/disable mixin operations
		 */
//		mixin_filtered_enabled: true,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinFiltered
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_filtered: function(self)
		{
			self.push_trace(self.trace, DevaptMixinFiltered.mixin_trace_filtered);
			var context = 'mixin_init_filtered()';
			self.enter(context, '');
			
			
			// INIT STATE
//			self.mixin_trace_filtered=true;
			self.mixin_filtered_enabled = true;
			self.mixin_filtered_is_processing = false;
			self.mixin_filtered_fields = null;
			self.mixin_filtered_value = null;
			self.mixin_filtered_delayed_count = 0;
			self.mixin_filtered_delayed_max= 1;
			console.log(self.mixin_filtered_enabled , 'self.mixin_filtered_enabled  1');
			// INIT EVENTS HANDLERS
			if (self.filtered && self.filtered.enabled)
			{
				if ( DevaptTypes.is_not_empty_str(self.filtered.event) && DevaptTypes.is_not_empty_str(self.filtered.source) )
				{
//					self.mixin_filtered_enabled = true;
					console.log(self.mixin_filtered_enabled , 'self.mixin_filtered_enabled  2');
					var promise = DevaptResources.get_resource_instance(self.filtered.source);
					
					promise.then(
						function(view)
						{
							self.filtered.view = view;
							view.add_event_callback(self.filtered.event, [self, self.on_filtered_event], false);
							console.log(self.mixin_filtered_enabled , 'self.mixin_filtered_enabled  3');
						}
					);
					
//					self.add_event_callback('devapt.container.refresh.end', [self, self.on_refreshed_event], false);
				}
				else
				{
					console.error(self.filtered, 'self.filtered');
				}
			}
			
			
			self.leave(context, '');
			self.pop_trace();
		},
			
		
		/**
		 * @public
		 * @memberof			DevaptMixinFiltered
		 * @desc				Process filtered event
		 * @param {array}		arg_event_operands		event operands array
		 * @return {nothing}
		 */
		on_filtered_event: function(arg_event_operands)
		{
			var self = this;
			var context = 'on_filtered_event(opds)';
			self.push_trace(self.trace, DevaptMixinFiltered.mixin_trace_filtered);
			self.enter(context, '');
			console.log(self.mixin_filtered_enabled , 'self.mixin_filtered_enabled  4');
			
			// GET OPERANDS
//			var event_obj = arg_event_operands[0];
//			var target_obj = arg_event_operands[1];
			var value = arg_event_operands[2].input;
			self.value(context, 'value', value);
			if (value === self.mixin_filtered_value)
			{
				self.leave(context, Devapt.msg_success + ':VALUE IS ALREADY FILTERED');
				self.pop_trace();
				return;
			}
			self.mixin_filtered_value = value;
			
			// GET FILTERED FIELDS
			var fields_names = DevaptTypes.is_not_empty_str(self.filtered.fields) ? self.filtered.fields.split(',') : self.items_fields;
			// console.log(fields_names, 'fields_names');
			self.mixin_filtered_fields = fields_names;
			
			// APPLY FILTERED VALUE ON FILTERED FIELDS
			self.apply_or_delay_filtered_value(value, fields_names);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinFiltered
		 * @desc					Apply or delay a filter value on all nodes records
		 * @param {string}			arg_filtered_value		value to filter on fields
		 * @param {array}			arg_fields_names		array of fields names strings
		 * @return {boolean}
		 */
		apply_or_delay_filtered_value: function(arg_filtered_value, arg_fields_names)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinFiltered.mixin_trace_filtered);
			var context = 'apply_or_delay_filtered_value(value,fields)';
			self.enter(context, '');
			console.log(self.mixin_filtered_is_processing , 'self.mixin_filtered_is_processing  5');
			
			// A FILTERING PROCESS IS ALREADY RUNNING
			if (self.mixin_filtered_is_processing)
			{
				// TEST MAX DELAYED TASKS
				if (self.mixin_filtered_delayed_count >= self.mixin_filtered_delayed_max)
				{
					self.leave(context, Devapt.msg_success + ':NOTHING TO DO, TOO MANY DELAYED TASKS');
					self.pop_trace();
					return true;
				}
				self.mixin_filtered_delayed_count++;
				
				// RECALL EVENT HANDLER AFTER A DELAY
				var task_cb = function()
				{
					console.log(self.mixin_filtered_is_processing , 'self.mixin_filtered_is_processing  6');
					self.apply_or_delay_filtered_value(arg_filtered_value, arg_fields_names);
				};
				setTimeout(task_cb, 10);
				
				self.leave(context, Devapt.msg_success + ':delay event handler');
				self.pop_trace();
				return true;
			}
			
			// UPDATE FILTERING STATE
			self.mixin_filtered_is_processing = true;
			
			// APPLY FILTERED VALUE ON FILTERED FIELDS
			var result = self.apply_filtered_value(arg_filtered_value, arg_fields_names);
			console.log(self.mixin_filtered_is_processing , 'self.mixin_filtered_is_processing  7');
			
			
			self.leave(context, result ? Devapt.msg_success : Devapt.msg_failure);
			self.pop_trace();
			return result;
		},
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinFiltered
		 * @desc					Apply a filter value on all nodes records
		 * @param {string}			arg_filtered_value		value to filter on fields
		 * @param {array}			arg_fields_names		array of fields names strings
		 * @return {boolean}
		 */
		apply_filtered_value: function(arg_filtered_value, arg_fields_names)
		{
			var self = this;
			self.push_trace(self.trace, DevaptMixinFiltered.mixin_trace_filtered);
			var context = 'apply_filtered_value(value,fields)';
			self.enter(context, '');
			self.value(context, 'mixin_filtered_enabled', self.mixin_filtered_enabled);
			self.value(context, 'arg_filtered_value', arg_filtered_value);
			self.value(context, 'arg_fields_names', arg_fields_names);
			self.value(context, 'mixin_filtered_is_processing', self.mixin_filtered_is_processing);
			debugger;
			
			// FILTERED FEATURE IS DISABLED
			if (! self.mixin_filtered_enabled)
			{
				// UPDATE FILTERING STATE
				self.mixin_filtered_is_processing = false;
				console.log(self, context + ':FILTERING IS DISABLED');
				
				self.leave(context, Devapt.msg_success + ':FILTERING IS DISABLED');
				self.pop_trace();
				return true;
			}
			
			// VIEW IS RENDERING
			if ( self.is_render_state_rendering() )
			{
				// UPDATE FILTERING STATE
				self.mixin_filtered_is_processing = false;
				
				self.leave(context, Devapt.msg_success + ':view is in rendering mode');
				self.pop_trace();
				return true;
			}
			
			
			// CHECK VALUE
			if (! DevaptTypes.is_string(arg_filtered_value) )
			{
				// UPDATE FILTERING STATE
				self.mixin_filtered_is_processing = false;
				
				self.leave(context, Devapt.msg_failure + ':BAD FILTERED VALUE');
				self.pop_trace();
				return false;
			}
			
			// CHECK FIELDS NAMES
			if (! DevaptTypes.is_not_empty_array(arg_fields_names) )
			{
				// UPDATE FILTERING STATE
				self.mixin_filtered_is_processing = false;
				
				self.leave(context, Devapt.msg_failure + ':BAD FIELDS NAMES');
				self.pop_trace();
				return false;
			}
			
			// GET CONTAINER NODES
			var nodes_jqo = self.get_all_nodes();
			if ( DevaptTypes.is_empty_str(arg_filtered_value) )
			{
				// NO FILTER
				nodes_jqo.show();
				nodes_jqo.addClass('devapt-container-visible');
				
				// UPDATE FILTERING STATE
				self.mixin_filtered_is_processing = false;
				
				self.leave(context, Devapt.msg_success + ':FILTERED VALUE IS EMPTY');
				self.pop_trace();
				return true;
			}
			
			// LOOP ON NODES
			var $ = Devapt.jQuery();
			var is_case_sensitive = DevaptTypes.to_boolean(self.filtered.case_sensitive, false);
			var value_pattern = '.*' + arg_filtered_value + '.*';
			var regex = new RegExp(value_pattern, is_case_sensitive ? '' : 'i');
			var items_count = 0;
			nodes_jqo.each(
				function(index, loop_node, array)
				{
					var loop_node_jqo = $(loop_node);
					loop_node_jqo.show();
					
					var loop_record = self.items_records[index];
//					console.log(loop_record, context + ':loop_record at [' + index + ']');
					
					if ( DevaptTypes.is_object(loop_record) )
					{
						var loop_node_filtered = true;
						
						for(var field_index in arg_fields_names)
						{
							var field_name = arg_fields_names[field_index];
							self.value(context, 'field_name', field_name);
							
							var field_value = loop_record.get(field_name);
							self.value(context, 'field_value', field_value);
							
							if ( DevaptTypes.is_not_empty_str(field_value) && regex.test(field_value) )
							{
								loop_node_filtered = false;
							}
						}
						
						// SHOW/HIDE NODE
						if (loop_node_filtered)
						{
							loop_node_jqo.hide();
							loop_node_jqo.removeClass('devapt-container-visible');
						}
						else
						{
							loop_node_jqo.addClass('devapt-container-visible');
							loop_node_jqo.show();
							items_count++;
						}
					}
				}
			);
			
			// UPDATE FILTERING STATE
			self.mixin_filtered_is_processing = false;
			
			// UPDATE PAGINATION
			self.fire_event('devapt.pagination.update_pagination', [ {'begin':0, 'end':items_count} ]);
			console.log(self.name, context + ':END');
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
			return true;
		}
		
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-23',
			'updated':'2015-06-01',
			'description':'Mixin methods for datas filtered feature for containers.'
		}
	};
	var DevaptMixinFilteredClass = new DevaptClass('DevaptMixinFiltered', null, class_settings);
	
	// METHODS
	DevaptMixinFilteredClass.infos.ctor = DevaptMixinFiltered.mixin_init_filtered;
	DevaptMixinFilteredClass.add_public_method('on_filtered_event', {}, DevaptMixinFiltered.on_filtered_event);
	DevaptMixinFilteredClass.add_public_method('apply_filtered_value', {}, DevaptMixinFiltered.apply_filtered_value);
	DevaptMixinFilteredClass.add_public_method('apply_or_delay_filtered_value', {}, DevaptMixinFiltered.apply_or_delay_filtered_value);
	
	// PROPERTIES
	DevaptMixinFilteredClass.add_public_obj_property('filtered',	'',	null, false, false, []);
	
	// BUILD MIXIN CLASS
	DevaptMixinFilteredClass.build_class();
	
	
	return DevaptMixinFilteredClass;
}
);