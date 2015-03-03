/**
 * @file        plugins/backend-foundation5/containers/list.js
 * @desc        Foundation 5 list class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-06-28
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'views/container', 'plugins/backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptContainer, undefined)
{
	/**
	 * @public
	 * @class				DevaptList
	 * @desc				List view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptList
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = 'constructor';
		self.enter(context, '');
		
		
		// CALL SUPER CLASS CONSTRUCTOR
		self._parent_class.infos.ctor(self);
		
		self.items_jquery_parent = null;
		self.items_jquery_filter = 'li';
		
		// self.add_event_callback('devapt.events.container.selected', [self, self.on_selected_item_event], false);
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptList
	 * @desc				Get a container item node by the node item text
	 * @param {string}		arg_node_item_text		node item text
	 * @return {object}		node jQuery object
	 */
	var cb_get_node_by_content = function(arg_node_item_text)
	{
		var self = this;
		var context = 'get_node_by_content(text)';
		self.enter(context, '');
		
		
		// SELECT ANCHOR BY CONTENT
		var a_jqo = $('li>a:contains("' + arg_node_item_text + '"):eq(0)', self.items_jquery_parent);
		if ( ! a_jqo)
		{
			self.leave(context, self.msg_failure);
			return null;
		}
		
		// GET ANCHOR PARENT
		var node_jqo = a_jqo.parent();
		
		
		self.leave(context, self.msg_success);
		return node_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptList
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
		
		self.ul_jqo = $('<ul>');
		self.content_jqo.append(self.ul_jqo);
		self.ul_jqo.addClass('side-nav');
		
		self.items_jquery_parent = self.ul_jqo;
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptList
	 * @desc				Render an empty item node
	 * @param {integer} 	arg_item_index		item index
	 * @return {object}		jQuery object node
	 */
	var cb_render_item_node = function(arg_item_index)
	{
		var self = this;
		var context = 'render_item_node(index)';
		self.enter(context, '');
		
		
		var node_jqo = $('<li>');
		node_jqo.click(
			function()
			{
				var node_index = parseInt( node_jqo.index() );
				self.select(node_index);
			}
		);
		
		
		self.leave(context, 'success');
		return node_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptList
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
		
		arg_item_jqo.addClass('divider');
		
		self.leave(context, self.msg_success);
		return arg_item_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptList
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
		
		var a_jqo = $('<a href="#">');
		a_jqo.html(arg_item_content);
		arg_item_jqo.append(a_jqo);
		
		self.leave(context, self.msg_success);
		return arg_item_jqo;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-05-09',
			'updated':'2014-12-13',
			'description':'Container view class to display a list of items.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptContainer;
	var DevaptListClass = new DevaptClass('DevaptList', parent_class, class_settings);
	
	// METHODS
	DevaptListClass.infos.ctor = cb_constructor;
	DevaptListClass.add_public_method('get_node_by_content', {}, cb_get_node_by_content);
	DevaptListClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptListClass.add_public_method('render_item_node', {}, cb_render_item_node);
	DevaptListClass.add_public_method('render_item_divider', {}, cb_render_item_divider);
	DevaptListClass.add_public_method('render_item_text', {}, cb_render_item_text);
	
	// PROPERTIES
	
	
	return DevaptListClass;
} );