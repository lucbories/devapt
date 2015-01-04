/**
 * @file        backend-foundation5/views/row.js
 * @desc        Foundation 5 row class
 *				API:
 *					EVENTS:
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict'
define(
['Devapt', 'core/types', 'core/class', 'views/container', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptContainer, undefined)
{
	/**
	 * @public
	 * @class				DevaptRow
	 * @desc				Row view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptRow
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
		self.content_jqo.addClass('row');
		self.content_jqo.addClass('devapt_row');
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
		var item_options = self.get_item_options(arg_item_index, { columns:1, small_columns:null, medium_columns:null, large_columns:null, centered:false });
		
		var item_columns		= DevaptTypes.to_integer(item_options.columns, 1);
		var item_small_columns	= DevaptTypes.to_integer(item_options.small_columns, item_columns);
		var item_medium_columns	= DevaptTypes.to_integer(item_options.medium_columns, item_columns);
		var item_large_columns	= DevaptTypes.to_integer(item_options.large_columns, item_columns);
		
		node_jqo.addClass('small-' + item_small_columns + ' medium-' + item_medium_columns + ' large-' + item_large_columns + ' columns');
		
		
		self.leave(context, 'success');
		return node_jqo;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-26',
			'updated':'2014-12-13',
			'description':'Container view class to display a row of items in columns (max=12).'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptContainer;
	var DevaptRowClass = new DevaptClass('DevaptRow', parent_class, class_settings);
	
	// METHODS
	DevaptRowClass.infos.ctor = cb_constructor;
	DevaptRowClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptRowClass.add_public_method('render_item_node', {}, cb_render_item_node);
	
	// PROPERTIES
	
	
	
	return DevaptRowClass;
} );