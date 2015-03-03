/**
 * @file        plugins/backend-foundation5/containers/vbox.js
 * @desc        Foundation 5 VBox class
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
	 * @class				DevaptVBox
	 * @desc				Vertical Box view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptVBox
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = 'constructor(' + self.name + ')';
		self.enter(context, '');
		
		
		// CALL SUPER CLASS CONSTRUCTOR
		self._parent_class.infos.ctor(self);
		
		self.items_jquery_parent = null;
		self.items_jquery_filter = 'div.row';
		
		// self.add_event_callback('devapt.events.container.selected', [self, self.on_selected_item_event], false);
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptVBox
	 * @desc				Begin the render of the container
	 * @return {nothing}
	 */
	var cb_render_begin = function()
	{
		var self = this;
		var context = 'render_begin()';
		self.enter(context, '');
		
		
		// CREATE MAIN NODE
		self.content_jqo = $('<div>');
		self.content_jqo.addClass('row');
		self.parent_jqo.append(self.content_jqo);
		
		self.items_jquery_parent = self.content_jqo;
		
		
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
		
		var node_jqo = $('<div>');
		node_jqo.addClass('row');
		
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
		
		if ( ! arg_item_jqo.hasClass('row') )
		{
			arg_item_jqo.addClass('row');
		}
		
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
	var DevaptVBoxClass = new DevaptClass('DevaptVBox', parent_class, class_settings);
	
	// METHODS
	DevaptVBoxClass.infos.ctor = cb_constructor;
	DevaptVBoxClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptVBoxClass.add_public_method('render_item_node', {}, cb_render_item_node);
	DevaptVBoxClass.add_public_method('render_item_divider', {}, cb_render_item_divider);
	
	// PROPERTIES
	DevaptVBoxClass.add_public_int_property('small_device_blocks',	'',	2, false, false, []);
	DevaptVBoxClass.add_public_int_property('medium_device_blocks',	'',	4, false, false, []);
	DevaptVBoxClass.add_public_int_property('large_device_blocks',	'',	6, false, false, []);
	
	
	
	return DevaptVBoxClass;
} );