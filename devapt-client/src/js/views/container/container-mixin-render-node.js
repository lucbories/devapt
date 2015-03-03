/**
 * @file        views/container/container-mixin-render-node.js
 * @desc        Mixin for datas items rendering feature for containers
 * @see			DevaptMixinRenderNode
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-02-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'core/template'],
function(Devapt, DevaptTypes, DevaptClass, DevaptTemplate)
{
	/**
	 * @mixin				DevaptMixinRenderNode
	 * @public
	 * @desc				Mixin of methods for datas items rendering features
	 */
	var DevaptMixinRenderNode = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinRenderNode
		 * @desc				Render an divider item content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		item node
		 * @param {string}		arg_item_content	item content
		 * @return {object}		jQuery object node
		 */
		render_item_divider: function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_divider(deferred,jqo,content)';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderNode
		 * @desc				Render an item HTML content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		render_item_html: function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_html(deferred,jqo,content)';
			self.enter(context, '');
			
			arg_item_jqo.html(arg_item_content);
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderNode
		 * @desc				Render an item TEXT content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		render_item_text: function(arg_deferred, arg_item_jqo, arg_item_content, arg_item_record)
		{
			var self = this;
			var context = 'render_item_text(deferred,jqo,content)';
			self.enter(context, '');
			
			
			var span_jqo = $('<span>');
			span_jqo.html(arg_item_content);
			arg_item_jqo.append(span_jqo);
			
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderNode
		 * @desc				Render an item RECORD content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {array}		arg_item_array
		 * @return {object}		jQuery object node
		 */
		render_item_array: function(arg_deferred, arg_item_jqo, arg_item_array)
		{
			var self = this;
			var context = 'render_item_array(deferred,jqo,content)';
			self.enter(context, '');
			
			
			// BUILD NODE CONTENT
			var tags_object = {};
			for(var field_index in self.items_fields)
			{
				var field_name = self.items_fields[field_index];
				tags_object[field_index] = arg_item_object[field_name];
			}
			
			var content = DevaptTemplate.render(self.items_format, tags_object);
			self.render_item_text(arg_deferred, arg_item_jqo, content);
			
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderNode
		 * @desc				Render an item CALLBACK content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		render_item_callback: function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_callback(deferred,jqo,content)';
			self.enter(context, '');
			
			// TODO render_item_object
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-02-23',
			'updated':'2015-02-23',
			'description':'Mixin methods for datas items rendering feature for containers.'
		}
	};
	var DevaptMixinRenderNodeClass = new DevaptClass('DevaptMixinRenderNode', null, class_settings);
	
	// METHODS
	DevaptMixinRenderNodeClass.add_public_method('render_item_divider', {}, DevaptMixinRenderNode.render_item_divider);
	DevaptMixinRenderNodeClass.add_public_method('render_item_html', {}, DevaptMixinRenderNode.render_item_html);
	DevaptMixinRenderNodeClass.add_public_method('render_item_text', {}, DevaptMixinRenderNode.render_item_text);
	DevaptMixinRenderNodeClass.add_public_method('render_item_array', {}, DevaptMixinRenderNode.render_item_array);
	DevaptMixinRenderNodeClass.add_public_method('render_item_callback', {}, DevaptMixinRenderNode.render_item_callback);
	
	// PROPERTIES
	
	// BUILD MIXIN CLASS
	DevaptMixinRenderNodeClass.build_class();
	
	
	return DevaptMixinRenderNodeClass;
}
);