/**
 * @file        views/mixin-get nodes.js
 * @desc        Mixin for container get nodes feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class'],
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
			self.push_trace(self.trace, self.mixin_trace_get_nodes);
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
			self.push_trace(self.trace, self.mixin_trace_get_nodes);
			self.enter(context, '');
			
			
			var nodes_jqo = $(self.items_jquery_filter, self.items_jquery_parent);
			
			
			self.leave(context, self.msg_success);
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
			var context = 'get_node_by_content(text)';
			self.push_trace(self.trace, self.mixin_trace_get_nodes);
			self.enter(context, '');
			
			
			var node_jqo = $(self.items_jquery_filter, self.items_jquery_parent).eq(arg_node_item_index);
			
			
			self.leave(context, self.msg_success);
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
			self.push_trace(self.trace, self.mixin_trace_get_nodes);
			self.enter(context, '');
			
			
			var node_jqo = null;
			
			
			self.leave(context, self.msg_default_empty_implementation);
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
			var context = 'get_node_by_content(field name, field value)';
			self.push_trace(self.trace, self.mixin_trace_get_nodes);
			self.enter(context, '');
			
			
			var node_jqo = null;
			var nodes_jqo = self.get_all_nodes();
			for(node_index in nodes_jqo)
			{
				var loop_node_jqo = $( nodes_jqo[node_index] );
				var loop_record = loop_node_jqo.data('record');
				if ( DevaptTypes.is_object(loop_record) )
				{
					var field_value = loop_record[arg_field_name];
					if (field_value === arg_field_value)
					{
						node_jqo = loop_node_jqo;
						break;
					}
				}
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return node_jqo;
		}
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinGetNodes
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	// DevaptMixinGetNodes.register_options = function(arg_prototype)
	// {
	// };
	
	
	
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