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
			
			self.leave(context, self.msg_default_empty_implementation);
			self.pop_trace();
			return $('<div>');
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
			
			self.leave(context, self.msg_default_empty_implementation);
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
			
			self.leave(context, self.msg_default_empty_implementation);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItem
		 * @desc				End the render of the container
		 * @param {object}			arg_deferred		deferred object
		 * @param {string|object}	arg_item_content	item content
		 * @param {integer} 		arg_item_index		item index
		 * @param {string} 			arg_item_type		item type
		 * @return {boolean}
		 */
		render_item: function(arg_deferred, arg_item_content, arg_item_index, arg_item_type)
		{
			var self = this;
			var context = 'render_item(deferred,content,index,type)';
			self.enter(context, '');
			self.value(context, 'arg_item_content', arg_item_content);
			
			
			// CREATE EMPTY ITEMNODE
			var node_jqo = self.render_item_node(arg_item_index);
			node_jqo.addClass('devapt-container-visible');
			
			// FILL ITEM NODE
			// console.log(arg_item_type, 'arg_item_type');
			switch(arg_item_type)
			{
				case 'divider':
				{
					if ( ! self.has_divider )
					{
						self.leave(context, 'bad divider item');
						// self.pop_trace();
						return false;
					}
					self.assert_function(context, 'self.render_item_divider', self.render_item_divider);
					node_jqo = self.render_item_divider(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'html':
				{
					self.assert_function(context, 'self.render_item_html', self.render_item_html);
					node_jqo = self.render_item_html(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'text':
				{
					self.assert_function(context, 'self.render_item_text', self.render_item_text);
					// console.log(node_jqo, context + ':node_jqo text before:' + self.name + ' for ' + arg_item_content);
					node_jqo = self.render_item_text(arg_deferred, node_jqo, arg_item_content);
					// console.log(node_jqo, context + ':node_jqo text after:' + self.name + ' for ' + arg_item_content);
					break;
				}
				case 'view':
				{
					self.assert_function(context, 'self.render_item_view', self.render_item_view);
					// console.log(node_jqo, context + ':node_jqo view before:' + self.name + ' for ' + arg_item_content);
					var view_promise = self.render_item_view(arg_deferred, node_jqo, arg_item_content);
					// console.log(node_jqo, context + ':node_jqo view after:' + self.name + ' for ' + arg_item_content);
					
					// APPEND ITEM NODE
					view_promise.then(
						function(view)
						{
							var record = {
								index: arg_item_index,
								type: arg_item_type,
								position: false,
								is_active:false,
								width: false,
								heigth: false,
								node: node_jqo
							};
							// console.log(record, context + ':record:' + self.name);
							self.append_item_node(node_jqo, record);
							self.items_objects.push(record);
							// self.items_jquery_nodes.push(node_jqo);
						}
					);
					
					self.leave(context, self.msg_success);
					// self.pop_trace();
					return true;
					// break;
				}
				case 'record':
				case 'object':
				{
					self.assert_function(context, 'self.render_item_object', self.render_item_object);
					arg_item_content.container_item_index = arg_item_index;
					// arg_item_content.container_item_type = arg_item_type;
					// arg_item_content.container_item_node = node_jqo;
					node_jqo = self.render_item_object(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'array':
				{
					self.assert_function(context, 'self.render_item_array', self.render_item_array);
					
					// ITEM RECORD
					var values_array = arg_item_content;
					if ( DevaptTypes.is_string(arg_item_content) )
					{
						values_array = arg_item_content.split('|', arg_item_content);
					}
					
					if ( ! DevaptTypes.is_array(values_array) )
					{
						break;
					}
					
					node_jqo = self.render_item_array(arg_deferred, node_jqo, values_array);
					break;
				}
				case 'callback':
				{
					self.assert_function(context, 'self.render_item_callback', self.render_item_callback);
					node_jqo = self.render_item_callback(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				default:
				{
					self.error('bad item type [' + arg_item_type + '] for [' + self.name + ']');
					self.leave(context, self.msg_failure);
					return false;
				}
			}
			
			// APPEND ITEM NODE
			var record = {
				index: arg_item_index,
				type: arg_item_type,
				position: false,
				is_active:false,
				width: false,
				heigth: false,
				node: node_jqo
			};
			// console.log(record, context + ':record:' + self.name);
			self.append_item_node(node_jqo, record);
			self.items_objects.push(record);
			// self.items_jquery_nodes.push(node_jqo);
			
			
			self.leave(context, self.msg_success);
			return true;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItem
		 * @desc				Append an item to the view
		 * @param {object}		arg_item_jqo		item jQuery object
		 * @param {object}		arg_item_record		item record
		 * @return {nothing}
		 */
		append_item_node: function(arg_item_jqo, arg_item_record)
		{
			var self = this;
			var context = 'append_item_node(item node, record)';
			self.enter(context, '');
			
			
			// console.log(arg_item_jqo, context + ':arg_item_jqo:' + self.name);
			if ( ! self.items_jquery_parent)
			{
				console.error(self.name, 'bad self.items_jquery_parent');
				console.log(arg_item_jqo, 'arg_item_jqo');
				
				self.leave(context, self.msg_failure);
				self.pop_trace();
				return false;
			}
			self.items_jquery_parent.append(arg_item_jqo);
			
			
			self.leave(context, self.msg_success);
			return true;
		}
	}
	
	
	
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
	DevaptMixinRenderItemClass.add_public_method('render_item', {}, DevaptMixinRenderItem.render_item);
	DevaptMixinRenderItemClass.add_public_method('append_item_node', {}, DevaptMixinRenderItem.append_item_node);
	
	// PROPERTIES
	
	// BUILD CLASS
	DevaptMixinRenderItemClass.build_class();
	
	
	return DevaptMixinRenderItemClass;
}
);