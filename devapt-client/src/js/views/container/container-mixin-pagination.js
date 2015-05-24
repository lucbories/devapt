/**
 * @file        views/container/container-mixin-pagination.js
 * @desc        Mixin for datas pagination feature for containers
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
['Devapt', 'core/types', 'object/class'],
function(Devapt, DevaptTypes, DevaptClass)
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
		mixin_init_pagination: function(self)
		{
			self.push_trace(self.trace, DevaptMixinPagination.mixin_trace_pagination);
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
			self.push_trace(self.trace, DevaptMixinPagination.mixin_trace_pagination);
			self.enter(context, '');
			
			// console.log(arg_event_operands, 'on_pagination_previous_event');
			
			self.leave(context, Devapt.msg_default_empty_implementation);
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
			self.push_trace(self.trace, DevaptMixinPagination.mixin_trace_pagination);
			self.enter(context, '');
			
			
//			console.log(arg_event_operands, context + ':on_pagination_current_event');
			
			
			var pagination = arg_event_operands[1];
			var page = arg_event_operands[2].page;
			
			var last_index = pagination.pagination_size * page - 1;
			var first_index = Math.max(last_index - pagination.pagination_size + 1, 0);
			// console.log(first_index, context + '.first_index');
			// console.log(last_index, context + '.last_index');
			
			self.apply_pagination(first_index, last_index);
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
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
			self.push_trace(self.trace, DevaptMixinPagination.mixin_trace_pagination);
			self.enter(context, '');
			
			// console.log(arg_event_operands, 'on_pagination_next_event');
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
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
			self.push_trace(self.trace, DevaptMixinPagination.mixin_trace_pagination);
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
			'updated':'2014-12-06',
			'description':'Mixin methods for datas pagination feature for containers.'
		}
	};
	var DevaptMixinPaginationClass = new DevaptClass('DevaptMixinPagination', null, class_settings);
	
	// METHODS
	DevaptMixinPaginationClass.infos.ctor = DevaptMixinPagination.mixin_init_pagination;
	DevaptMixinPaginationClass.add_public_method('on_pagination_previous_event', {}, DevaptMixinPagination.on_pagination_previous_event);
	DevaptMixinPaginationClass.add_public_method('on_pagination_current_event', {}, DevaptMixinPagination.on_pagination_current_event);
	DevaptMixinPaginationClass.add_public_method('on_pagination_next_event', {}, DevaptMixinPagination.on_pagination_next_event);
	DevaptMixinPaginationClass.add_public_method('apply_pagination', {}, DevaptMixinPagination.apply_pagination);
	
	// PROPERTIES
	DevaptMixinPaginationClass.add_public_int_property('mixin_pagination_apply_count',	'',		0, false, false, []);
	
	// BUILD CLASS
	DevaptMixinPaginationClass.build_class();
	
	
	return DevaptMixinPaginationClass;
}
);