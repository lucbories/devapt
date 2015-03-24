/**
 * @file        views/mixin-get nodes.js
 * @desc        Mixin for container get nodes feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-11-15
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
	 * @mixin				DevaptMixinGetNodes
	 * @public
	 * @desc				Mixin of methods for container get nodes features
	 */
	var DevaptMixinGetNodes = 
	{
		/**
		 * @memberof			DevaptMixinGetNodes
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_get_nodes: false,
		
		
		
		/**
		 * @memberof			DevaptMixinGetNodes
		 * @public
		 * @desc				Enable/disable mixin operations
		 */
		mixin_filtered_enabled: true,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinGetNodes
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_get_nodes: function(self)
		{
			self.push_trace(self.trace, DevaptMixinGetNodes.mixin_trace_get_nodes);
			var context = 'mixin_init_get_nodes()';
			self.enter(context, '');
			
			
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinGetNodes
		 * @desc				Get all container nodes
		 * @return {array}		array of node jQuery objects
		 */
		get_all_nodes: function()
		{
			var self = this;
			var context = 'get_all_nodes()';
			self.push_trace(self.trace, DevaptMixinGetNodes.mixin_trace_get_nodes);
			self.enter(context, '');
			
			
			var nodes_jqo = $(self.items_jquery_filter, self.items_jquery_parent);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
			return nodes_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinGetNodes
		 * @desc				Get a container item node by the node item index
		 * @param {integer}		arg_node_item_index		node item index
		 * @return {object}		node jQuery object
		 */
		get_node_by_index: function(arg_node_item_index)
		{
			var self = this;
			var context = 'get_node_by_index(index)';
			self.push_trace(self.trace, DevaptMixinGetNodes.mixin_trace_get_nodes);
			self.enter(context, '');
			
			
			var node_jqo = $(self.items_jquery_filter, self.items_jquery_parent).eq(arg_node_item_index);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
			return node_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinGetNodes
		 * @desc				Get a container item node by the node item text
		 * @param {string}		arg_node_item_text		node item text
		 * @return {object}		node jQuery object
		 */
		get_node_by_content: function(arg_node_item_text)
		{
			var self = this;
			var context = 'get_node_by_content(text)';
			self.push_trace(self.trace, DevaptMixinGetNodes.mixin_trace_get_nodes);
			self.enter(context, '');
			
			
			var node_jqo = null;
			
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return node_jqo;
		},
			
		
		/**
		 * @public
		 * @memberof			DevaptMixinGetNodes
		 * @desc				Get a container item node by the node item text
		 * @param {object}		arg_field_name				field name
		 * @param {object}		arg_field_value				field value
		 * @return {object}		node jQuery object
		 */
		get_node_by_field_value: function(arg_field_name, arg_field_value)
		{
			var self = this;
			var context = 'get_node_by_field_value(field name, field value)';
			self.push_trace(self.trace, DevaptMixinGetNodes.mixin_trace_get_nodes);
			self.enter(context, '');
			
			
			var node_jqo = null;
			var nodes_jqo = self.get_all_nodes();
			if ( DevaptTypes.is_not_empty_object(nodes_jqo) )
			{
				self.step(context, 'all nodes is an array');
				self.value(context, 'nodes_jqo.length', nodes_jqo.length);
				
				for(var node_index = 0 ; node_index < nodes_jqo.length ; node_index++)
				{
					self.value(context, 'loop on node index', node_index);
					
					// var loop_node_jqo = $( nodes_jqo[node_index] );
					// var loop_record = loop_node_jqo.data('record');
					var loop_record = self.items_records[node_index];
					self.value(context, 'loop_record', loop_record);
					if ( DevaptTypes.is_object(loop_record) )
					{
						self.step(context, 'loop record is an object');
						var field_value = loop_record[arg_field_name];
						if (field_value === arg_field_value)
						{
							self.step(context, 'record field value = arg field value');
							var loop_node_jqo = $( nodes_jqo[node_index] );
							node_jqo = loop_node_jqo;
							break;
						}
					}
					else
					{
						self.step(context, 'loop record is not an object');
					}
				}
			}
			else
			{
				self.step(context, 'all nodes is not an array');
				console.error(nodes_jqo);
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return node_jqo;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-23',
			'updated':'2014-12-06',
			'description':'Mixin methods for get nodes feature for containers.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinGetNodesClass
	 * @public
	 * @desc				Mixin of methods for get nodes feature for containers
	 */
	var DevaptMixinGetNodesClass = new DevaptClass('DevaptMixinGetNodes', null, class_settings);
	
	// DevaptMixinGetNodesClass.infos.ctor = DevaptMixinGetNodes.mixin_init_filtered;
	DevaptMixinGetNodesClass.add_public_method('get_all_nodes', {}, DevaptMixinGetNodes.get_all_nodes);
	DevaptMixinGetNodesClass.add_public_method('get_node_by_index', {}, DevaptMixinGetNodes.get_node_by_index);
	DevaptMixinGetNodesClass.add_public_method('get_node_by_content', {}, DevaptMixinGetNodes.get_node_by_content);
	DevaptMixinGetNodesClass.add_public_method('get_node_by_field_value', {}, DevaptMixinGetNodes.get_node_by_field_value);
	
	DevaptMixinGetNodesClass.build_class();
	
	
	return DevaptMixinGetNodesClass;
}
);