/**
 * @file        plugins/backend-foundation5/containers/tabs.js
 * @desc        Foundation 5 list class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-07-27
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
	 * @class				DevaptTabs
	 * @desc				Tabs panel view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptTabs
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// CONSTRUCTOR BEGIN
		var context = 'constructor(' + self.name + ')';
		self.enter(context, '');
		
		
		self.tabs_jqo			= null;
		self.tabs_content_jqo	= null;
		self.has_divider		= false;
		
		// self.add_event_callback('devapt.events.container.selected', [self, self.on_selected_item_event], false);
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptTabs
	 * @desc				Begin the render of the container
	 * @return {nothing}
	 */
	var cb_render_begin = function()
	{
		var self = this;
		var context = 'render_begin()';
		self.enter(context, '');
		
		
		// CHECK CONTENT NODE
		self.assert_not_null(context, 'content_jqo', self.content_jqo);
		
		self.tabs_jqo = $('<dl>');
		self.tabs_jqo.addClass('tabs');
		self.tabs_jqo.attr('data-tab', '');
		
		self.tabs_content_jqo = $('<div>');
		self.tabs_content_jqo.addClass('tabs-content');
		
		self.content_jqo.append(self.tabs_jqo);
		self.content_jqo.append(self.tabs_content_jqo);
		self.content_jqo.append( $('<div class="clearfix">') );
		
		if (self.is_vertical)
		{
			self.tabs_jqo.addClass('vertical');
			self.tabs_content_jqo.addClass('vertical');
		}
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				End the render of the container
	 * @return {nothing}
	 */
	var cb_render_end = function()
	{
		var self = this;
		var context = 'render_end()';
		self.enter(context, '');
		
		
		// INIT FOUNDATION
		self.content_jqo.foundation();
		
		// HANDLE EVENT
		self.tabs_jqo.on('toggled', 
			function (event, tabs)
			{
				// SEND EVENT
				self.fire_event('devapt.tabs.changed', [event, tabs]);
			}
		);
		
		// ENABLE ACTIVE TAB
		if ( ! $('.content.active', self.content_jqo) )
		{
			$('.content', self.content_jqo)[0].addClass('active');
		}
		
		
		self.leave(context, self.msg_success);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptTabs
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
		node_jqo.addClass('content');
		node_jqo.attr('id', self.name + '_content_' + arg_item_index + '_id');
		
		self.leave(context, 'success');
		return node_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptTabs
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
		
		var p_jqo = $('<p>');
		p_jqo.html(arg_item_content);
		arg_item_jqo.append(p_jqo);
		
		self.leave(context, self.msg_success);
		return arg_item_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptContainer
	 * @desc				Append an item to the view
	 * @param {object}		arg_item_jqo		item jQuery object
	 * @param {object}		arg_item_record		item record
	 * @return {nothing}
	 */
	var cb_append_item_node = function(arg_item_jqo, arg_item_record)
	{
		var self = this;
		var context = 'render_self(deferred)';
		self.enter(context, '');
		
		
		// GET ITEM OPTIONS
		var item_options = self.get_item_options(arg_item_record.index, { label:'tab ' + arg_item_record.index, active:false });
		
		
		// TABS CONTENT
		self.tabs_content_jqo.append(arg_item_jqo);
		
		
		// TABS MENU
		var li_jqo = $('<dd>');
		li_jqo.addClass('tab-title');
		self.tabs_jqo.append(li_jqo);
		
		var a_jqo = $('<a href="#">');
		var item_content_id = '#' + self.name + '_content_' + arg_item_record.index + '_id';
		var item_label = item_options.label;
		if (item_options.active)
		{
			li_jqo.addClass('active');
			arg_item_jqo.addClass('active');
		}
		
		a_jqo.html(item_label);
		a_jqo.attr('href', item_content_id);
		li_jqo.append(a_jqo);
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-27',
			'updated':'2014-12-13',
			'description':'Container view class to display a panel of tabs of items, horizontally (default), vertically (is_vertical:true).'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptContainer;
	var DevaptTabsClass = new DevaptClass('DevaptTabs', parent_class, class_settings);
	
	// METHODS
	DevaptTabsClass.infos.ctor = cb_constructor;
	DevaptTabsClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptTabsClass.add_public_method('render_end', {}, cb_render_end);
	DevaptTabsClass.add_public_method('render_item_node', {}, cb_render_item_node);
	DevaptTabsClass.add_public_method('render_item_text', {}, cb_render_item_text);
	DevaptTabsClass.add_public_method('append_item_node', {}, cb_append_item_node);
	
	// PROPERTIES
	DevaptTabsClass.add_public_bool_property('is_vertical',	'',	false, false, false, []);
	
	
	return DevaptTabsClass;
} );