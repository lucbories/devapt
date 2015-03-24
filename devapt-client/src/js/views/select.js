/**
 * @file        views/select.js
 * @desc        Select HTML tag Class
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-01-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'views/container'],
function(Devapt, DevaptTypes, DevaptClass, DevaptContainer)
{
	/**
	 * @public
	 * @class				DevaptSelect
	 * @desc				Select view class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptSelect
	 * @desc				Constructor
	 * @param {object}		instance object
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		console.log(self);
		// CONSTRUCTOR BEGIN
		var context = 'constructor(' + self.name + ')';
		self.enter(context, '');
		
		
		// CALL SUPER CLASS CONSTRUCTOR
		self._parent_class.infos.ctor(self);
		
		self.items_jquery_parent = null;
		self.items_jquery_filter = 'option';
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptSelect
	 * @desc				Get a container item node by the node item text
	 * @param {string}		arg_node_item_text		node item text
	 * @return {object}		node jQuery object
	 */
	var cb_get_node_by_content = function(arg_node_item_text)
	{
		var self = this;
		var context = 'get_node_by_content(text)';
		self.enter(context, '');
		
		
		// SELECT OPTION BY CONTENT
		var item_jqo = $('option:contains("' + arg_node_item_text + '"):eq(0)', self.items_jquery_parent);
		if ( ! item_jqo)
		{
			self.leave(context, self.msg_failure);
			return null;
		}
		
		// GET ANCHOR PARENT
		var node_jqo = item_jqo.parent();
		
		
		self.leave(context, self.msg_success);
		return node_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptSelect
	 * @desc				Begin the render of the container
	 * @return {nothing}
	 */
	var cb_render_begin = function()
	{
		var self = this;
		var context = 'render_begin()';
		self.enter(context, '');
		
		
		self.content_jqo = $('<div>');
		self.parent_jqo.append(self.content_jqo);
		self.content_jqo.attr('id', self.get_view_id());
		
		self.items_jquery_parent = $('<select>');
		self.content_jqo.append(self.items_jquery_parent);
		
		// MULTIPLE SELECTION ?
		if (self.has_multiple_selection)
		{
			self.items_jquery_parent.attr('multiple', '');
		}
		
		// VISIBLE ITEMS
		if (self.items_visible_count)
		{
			self.items_jquery_parent.attr('size', self.items_visible_count);
		}
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptSelect
	 * @desc				Render an empty item node
	 * @param {integer} 	arg_item_index		item index (ignored)
	 * @return {object}		jQuery object node
	 */
	var cb_render_item_node = function(arg_item_index)
	{
		var self = this;
		var context = 'render_item_node(index)';
		self.enter(context, '');
		
		
		var node_jqo = $('<option>');
		node_jqo.click(
			function()
			{
				var node_index = parseInt( node_jqo.index() );
				self.select_item_node(node_index);
			}
		);
		
		
		self.leave(context, 'success');
		return node_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptSelect
	 * @desc				Render an divider item content
	 * @param {object}		arg_deferred		deferred object
	 * @param {object}		arg_item_jqo		
	 * @param {string}		arg_item_content
	 * @return {object}		jQuery object node
	 */
	var cb_render_item_divider = function(arg_deferred, arg_item_jqo, arg_item_content)
	{
		var self = this;
		var context = 'render_item_divider(deferred,jqo,content)';
		self.enter(context, '');
		
		arg_item_jqo.attr('disabled', '');
		
		self.leave(context, self.msg_success);
		return arg_item_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptSelect
	 * @desc				Render an item TEXT content
	 * @param {object}		arg_deferred		deferred object
	 * @param {object}		arg_item_jqo		
	 * @param {string}		arg_item_content
	 * @return {object}		jQuery object node
	 */
	var cb_render_item_text = function(arg_deferred, arg_item_jqo, arg_item_content)
	{
		var self = this;
		var context = 'render_item_text(deferred,jqo,content)';
		self.enter(context, '');
		self.value(context, 'arg_item_content', arg_item_content);
		
		
		arg_item_jqo.text(arg_item_content);
		
		
		self.leave(context, self.msg_success);
		return arg_item_jqo;
	}
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2014-05-09',
			updated:'2014-12-06',
			description:'Select view class.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptContainer;
	var DevaptSelectClass = new DevaptClass('DevaptSelect', parent_class, class_settings);
	
	// METHODS
	DevaptSelectClass.infos.ctor = cb_constructor;
	DevaptSelectClass.add_public_method('get_node_by_content', {}, cb_get_node_by_content);
	DevaptSelectClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptSelectClass.add_public_method('render_item_node', {}, cb_render_item_node);
	DevaptSelectClass.add_public_method('render_item_divider', {}, cb_render_item_divider);
	DevaptSelectClass.add_public_method('render_item_text', {}, cb_render_item_text);
	
	// PROPERTIES
	
	
	return DevaptSelectClass;
} );