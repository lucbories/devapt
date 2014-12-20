/**
 * @file        backend-foundation5/containers/hbox.js
 * @desc        Foundation 5 HBox class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-06-28
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class', 'views/container', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptContainer, undefined)
{
	/**
	 * @public
	 * @class				DevaptHBox
	 * @desc				Horizontal Box view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptHBox
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
		self.items_jquery_filter = 'li';
		
		// self.add_event_callback('devapt.events.container.selected', [self, self.on_selected_item_event], false);
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptHBox
	 * @desc				Begin the render of the container
	 * @return {nothing}
	 */
	var cb_render_begin = function()
	{
		var self = this;
		var context = 'render_begin()';
		self.enter(context, '');
		
		
		// GET BLOCKS COUNT
		var small_blocks  = Math.max( Math.min(self.small_device_blocks, 12), 1);
		var medium_blocks = Math.max( Math.min(self.medium_device_blocks, 12), 1);
		var large_blocks  = Math.max( Math.min(self.large_device_blocks, 12), 1);
		
		// CREATE MAIN NODE
		self.content_jqo = $('<ul>');
		self.content_jqo.addClass('small-block-grid-' + small_blocks);
		self.content_jqo.addClass('medium-block-grid-' + medium_blocks);
		self.content_jqo.addClass('large-block-grid-' + large_blocks);
		self.parent_jqo.append(self.content_jqo);
		
		self.items_jquery_parent = self.content_jqo;
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptHBox
	 * @desc				Render an empty item node
	 * @param {integer} 	arg_item_index		item index
	 * @return {object}		jQuery object node
	 */
	var cb_render_item_node = function(arg_item_index)
	{
		var self = this;
		var context = 'render_item_node(index)';
		self.enter(context, '');
		
		var li_jqo = $('<li>');
		
		self.leave(context, 'success');
		return li_jqo;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-05-09',
			'updated':'2014-12-13',
			'description':'Container view class to display an horizontal box of items.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptContainer;
	var DevaptHBoxClass = new DevaptClass('DevaptHBox', parent_class, class_settings);
	
	// METHODS
	DevaptHBoxClass.infos.ctor = cb_constructor;
	DevaptHBoxClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptHBoxClass.add_public_method('render_item_node', {}, cb_render_item_node);
	
	// PROPERTIES
	DevaptHBoxClass.add_public_int_property('small_device_blocks',	'',	2, false, false, []);
	DevaptHBoxClass.add_public_int_property('medium_device_blocks',	'',	4, false, false, []);
	DevaptHBoxClass.add_public_int_property('large_device_blocks',	'',	6, false, false, []);
	
	
	return DevaptHBoxClass;
} );