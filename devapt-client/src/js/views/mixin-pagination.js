/**
 * @file        views/mixin-pagination.js
 * @desc        Mixin for datas pagination feature for containers
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
	 * @mixin				DevaptMixinPagination
	 * @public
	 * @desc				Mixin of methods for datas pagination features
	 */
	var DevaptMixinPagination = 
	{
		/**
		 * @memberof			DevaptMixinPagination
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_pagination: false,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinPagination
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_pagination: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_pagination);
			var context = 'mixin_init_pagination()';
			self.enter(context, '');
			
			
			self.mixin_pagination_apply_count = 0;
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinPagination
		 * @desc				Process pagination previous update event
		 * @param {array}		arg_event_operands		event operands array
		 * @return {nothing}
		 */
		on_pagination_previous_event: function(arg_event_operands)
		{
			var self = this;
			var context = 'on_pagination_previous_event(opds)';
			self.push_trace(self.trace, self.mixin_trace_pagination);
			self.enter(context, '');
			
			// console.log(arg_event_operands, 'on_pagination_previous_event');
			
			self.leave(context, self.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinPagination
		 * @desc				Process pagination current update event
		 * @param {array}		arg_event_operands		event operands array
		 * @return {nothing}
		 */
		on_pagination_current_event: function(arg_event_operands)
		{
			var self = this;
			var context = 'on_pagination_current_event(opds)';
			self.push_trace(self.trace, self.mixin_trace_pagination);
			self.enter(context, '');
			
			
			// console.log(arg_event_operands, 'on_pagination_current_event');
			
			var pagination = arg_event_operands[1];
			var page = arg_event_operands[2];
			
			var last_index = pagination.pagination_size * page - 1;
			var first_index = Math.max(last_index - pagination.pagination_size + 1, 0);
			// console.log(first_index, context + '.first_index');
			// console.log(last_index, context + '.last_index');
			
			self.apply_pagination(first_index, last_index);
			
			
			self.leave(context, self.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinPagination
		 * @desc				Process pagination next update event
		 * @param {array}		arg_event_operands		event operands array
		 * @return {nothing}
		 */
		on_pagination_next_event: function(arg_event_operands)
		{
			var self = this;
			var context = 'on_pagination_next_event(opds)';
			self.push_trace(self.trace, self.mixin_trace_pagination);
			self.enter(context, '');
			
			// console.log(arg_event_operands, 'on_pagination_next_event');
			
			
			self.leave(context, self.msg_default_empty_implementation);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinPagination
		 * @desc					Get a filtered array of records
		 * @param {integer}			arg_first_index		page first index
		 * @param {integer}			arg_last_index		page last index
		 * @return {boolean}
		 */
		apply_pagination: function(arg_first_index, arg_last_index)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_pagination);
			var context = 'apply_pagination(first,last)';
			self.enter(context, '');
			self.value(context, 'arg_first_index', arg_first_index);
			self.value(context, 'arg_last_index', arg_last_index);
			
			
			// UPDATE FILTERED
			if (self.apply_filtered_value && self.mixin_filtered_value && self.mixin_filtered_value !== '')
			{
				self.apply_filtered_value(self.mixin_filtered_value, self.mixin_filtered_fields);
			}
			
			
			// GET CONTAINER NODES
			var nodes_jqo = self.get_all_nodes();
			nodes_jqo.hide();
			
			// LOOP ON NODES
			nodes_jqo.filter('.devapt-container-visible').each(
				function(index, loop_node, array)
				{
					var loop_node_jqo = $(loop_node);
					
					if (index >= arg_first_index && index <= arg_last_index)
					{	
						loop_node_jqo.show();
					}
					else
					{
						loop_node_jqo.hide();
					}
				}
			);
			self.mixin_pagination_apply_count++;
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return true;
		}
		
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinPagination
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	DevaptMixinPagination.register_options = function(arg_prototype)
	{
	};
	
	
	return DevaptMixinPagination;
}
);