/**
 * @file        views/container/container-mixin-render-items.js
 * @desc        Mixin for datas items rendering feature for containers
 * @see			DevaptMixinRenderItem
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-11-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'core/template',
	'views/container/container-mixin-render-node', 'views/container/container-mixin-render-view', 'views/container/container-mixin-render-object'],
function(Devapt, DevaptTypes, DevaptClass, DevaptTemplate,
	DevaptMixinRenderNode, DevaptMixinRenderView, DevaptMixinRenderObject)
{
	/**
	 * @mixin				DevaptMixinRenderItem
	 * @public
	 * @desc				Mixin of methods for datas items rendering features
	 */
	var DevaptMixinRenderItem = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItem
		 * @desc				Render an empty item node
		 * @param {integer} 	arg_item_index		item index
		 * @return {object}		jQuery object node
		 */
		render_item_node: function(arg_item_index)
		{
			var self = this;
			var context = 'render_item_node(index)';
			self.enter(context, '');
			
			// NOT IMPLEMENTED HERE
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return window.$('<div>');
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItem
		 * @desc				Render an empty record node for the container item
		 * @param {object}		arg_item_jqo		item node
		 * @return {object}		jQuery object node
		 */
		render_item_record_node: function(arg_item_jqo)
		{
			var self = this;
			var context = 'render_item_record_node(item node)';
			self.push_trace(self.trace, DevaptMixinRenderItem.mixin_trace_render_items);
			self.enter(context, '');
			
			// NOT IMPLEMENTED HERE
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItem
		 * @desc				Render an empty record field node for the container item
		 * @param {object}		arg_item_jqo		item node
		 * @return {object}		jQuery object node
		 */
		render_item_field_node: function(arg_item_jqo)
		{
			var self = this;
			var context = 'render_item_field_node(item node)';
			self.push_trace(self.trace, DevaptMixinRenderItem.mixin_trace_render_items);
			self.enter(context, '');
			
			// NOT IMPLEMENTED HERE
			
			self.leave(context, Devapt.msg_default_empty_implementation);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItem
		 * @desc				Append an item to the view
		 * @param {object}		arg_container_item		A plain object of a container item
		 * @return {boolean}
		 */
		append_item_node: function(arg_container_item)
		{
			var self = this;
			var context = 'append_item_node(item)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			self.assert_object(context, 'item', arg_container_item);
			self.assert_true(context, 'item.is_container_item', arg_container_item.is_container_item);
			
			
			if ( ! self.items_jquery_parent)
			{
				console.error(self.name, 'bad self.items_jquery_parent');
				console.log(arg_container_item.node, 'arg_item_jqo');
				
				self.leave(context, Devapt.msg_failure);
				return false;
			}
			
			self.items_jquery_parent.append(arg_container_item.node);
			
			
			self.leave(context, Devapt.msg_success);
			return true;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItem
		 * @desc				Test a an item is selected
		 * @param {object}		arg_container_item		A plain object of a container item
		 * @return {boolean}
		 */
		is_selected_item_node: function(arg_container_item)
		{
			var self = this;
			var context = 'is_selected_item_node(item)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			self.assert_object(context, 'item', arg_container_item);
			self.assert_true(context, 'item.is_container_item', arg_container_item.is_container_item);
			self.assert_not_empty_string(context, 'item.id', arg_container_item.id);
			self.assert_integer(context, 'item.index', arg_container_item.index);
			self.assert_true(context, 'item index >= 0', arg_container_item.index >= 0);
			
			
			arg_container_item.is_selected = self.has_item_node_css_class(arg_container_item.node_jqo, 'selected');
			
			
			self.leave(context, Devapt.msg_success);
			return true;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-23',
			'updated':'2015-02-23',
			'description':'Mixin methods for datas items rendering feature for containers.'
		},
		mixins:[DevaptMixinRenderView, DevaptMixinRenderObject, DevaptMixinRenderNode]
	};
	var DevaptMixinRenderItemClass = new DevaptClass('DevaptMixinRenderItem', null, class_settings);
	
	// METHODS
	DevaptMixinRenderItemClass.add_public_method('render_item_node', {}, DevaptMixinRenderItem.render_item_node);
	DevaptMixinRenderItemClass.add_public_method('render_item_record_node', {}, DevaptMixinRenderItem.render_item_record_node);
	DevaptMixinRenderItemClass.add_public_method('render_item_field_node', {}, DevaptMixinRenderItem.render_item_field_node);
	// DevaptMixinRenderItemClass.add_public_method('render_item', {}, DevaptMixinRenderItem.render_item);
	DevaptMixinRenderItemClass.add_public_method('append_item_node', {}, DevaptMixinRenderItem.append_item_node);
	DevaptMixinRenderItemClass.add_public_method('is_selected_item_node', {}, DevaptMixinRenderItem.is_selected_item_node);
	
	// PROPERTIES
	
	// BUILD CLASS
	DevaptMixinRenderItemClass.build_class();
	
	
	return DevaptMixinRenderItemClass;
}
);