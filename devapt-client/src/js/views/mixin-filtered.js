/**
 * @file        views/mixin-filtered.js
 * @desc        Mixin for datas filtered feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_CORE
 * @date        2014-08-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/options', 'core/classes', 'core/resources'],
function(Devapt, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources)
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
		mixin_trace_filtered: false,
		
		
		
		/**
		 * @memberof			DevaptMixinFiltered
		 * @public
		 * @desc				Enable/disable mixin operations
		 */
		mixin_filtered_enabled: true,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinFiltered
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_filtered: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_filtered);
			var context = 'mixin_init_filtered()';
			self.enter(context, '');
			
			
			if (self.filtered && self.filtered.enabled && DevaptTypes.is_not_empty_str(self.filtered.event) && DevaptTypes.is_not_empty_str(self.filtered.source) )
			{
				self.mixin_filtered_enabled = true;
				var promise = DevaptResources.get_resource_instance(self.filtered.source);
				
				promise.done(
					function(view)
					{
						self.filtered.view = view;
						view.add_event_callback(self.filtered.event, [self, self.on_filtered_event], false);
					}
				);
				
				// promise.fail(
					// function()
					// {
						// console.log(self.filtered_jqo, 'self.filtered_jqo');
						// console.log(self.filtered, 'self.filtered');
						
						// self.leave(context, '');
						// self.pop_trace();
						// return;
					// }
				// );
				
				// self.value(context, 'add callback on event', self.filtered.event);
				// self.add_event_callback(self.filtered.event, [self, self.on_filtered_event], false);
			}
			else
			{
				console.error(self.filtered, 'self.filtered');
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
			self.push_trace(self.trace, self.mixin_trace_filtered);
			self.enter(context, '');
			
			
			// GET OPERANDS
			var event_obj = arg_event_operands[0];
			var target_obj = arg_event_operands[1];
			var value = arg_event_operands[2];
			self.value(context, 'value', value);
			self.mixin_filtered_value = value;
			
			// GET FILTERED FIELDS
			var fields_names = DevaptTypes.is_not_empty_str(self.filtered.fields) ? self.filtered.fields.split(',') : self.items_fields;
			// console.log(fields_names, 'fields_names');
			self.mixin_filtered_fields = fields_names;
			
			// APPLY FILTERED VALUE ON FILTERED FIELDS
			self.apply_filtered_value(value, fields_names);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinFiltered
		 * @desc					Get a filtered array of records
		 * @param {string}			arg_filtered_value		value to filter on fields
		 * @param {array}			arg_fields_names		array of fields names strings
		 * @return {boolean}
		 */
		apply_filtered_value: function(arg_filtered_value, arg_fields_names)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_filtered);
			var context = 'apply_filtered_value(value,fields)';
			self.enter(context, '');
			self.value(context, 'mixin_filtered_enabled', self.mixin_filtered_enabled);
			self.value(context, 'arg_filtered_value', arg_filtered_value);
			self.value(context, 'arg_fields_names', arg_fields_names);
			
			
			// FILTERED FEATURE IS DISABLED
			if (! self.mixin_filtered_enabled)
			{
				self.leave(context, self.msg_success);
				self.pop_trace
				return true;
			}
			
			// CHECK VALUE
			if (! DevaptTypes.is_string(arg_filtered_value) )
			{
				self.leave(context, self.msg_failure);
				self.pop_trace
				return false;
			}
			
			// CHECK FIELDS NAMES
			if (! DevaptTypes.is_not_empty_array(arg_fields_names) )
			{
				self.leave(context, self.msg_failure);
				self.pop_trace
				return false;
			}
			
			// GET CONTAINER NODES
			var nodes_jqo = self.get_all_nodes();
			if ( DevaptTypes.is_empty_str(arg_filtered_value) )
			{
				nodes_jqo.show();
				nodes_jqo.addClass('devapt-container-visible');
				
				self.leave(context, self.msg_success);
				self.pop_trace
				return true;
			}
			
			// LOOP ON NODES
			var is_case_sensitive = DevaptTypes.to_boolean(self.filtered.case_sensitive, false);
			var value_pattern = '.*' + arg_filtered_value + '.*';
			var regex = new RegExp(value_pattern, is_case_sensitive ? '' : 'i');
			var items_count = 0;
			nodes_jqo.each(
				function(index, loop_node, array)
				{
					var loop_node_jqo = $(loop_node);
					loop_node_jqo.show();
					
					var loop_record = loop_node_jqo.data('record');
					if ( DevaptTypes.is_object(loop_record) )
					{
						var loop_node_filtered = true;
						
						for(field_index in arg_fields_names)
						{
							var field_name = arg_fields_names[field_index];
							self.value(context, 'field_name', field_name);
							
							var field_value = loop_record[field_name];
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
			
			// UPDATE PAGINATION
			// self.fire_event('devapt.pagination.update_filtered_pagination', [0, items_count]);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return true;
		}
		
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinFiltered
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	DevaptMixinFiltered.register_options = function(arg_prototype)
	{
	};
	
	
	return DevaptMixinFiltered;
}
);