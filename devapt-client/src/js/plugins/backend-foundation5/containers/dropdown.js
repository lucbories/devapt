/**
 * @file        plugins/backend-foundation5/containers/dropdown.js
 * @desc        Foundation 5 dropdown class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-08-05
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'views/container', 'worker/timer', 'plugins/backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptContainer, DevaptTimerWorker, undefined)
{
	/**
	 * @public
	 * @class				DevaptDropdown
	 * @desc				Dropdown view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptDropdown
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
		
		self.add_event_callback('devapt.events.container.selected', [self, self.on_selected_item_event], false);
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptDropdown
	 * @desc				Get a container item node by the node item text
	 * @param {string}		arg_node_item_text		node item text
	 * @return {object}		node jQuery object
	 */
	var cb_get_node_by_content = function(arg_node_item_text)
	{
		var self = this;
		var context = 'get_node_by_content(text)';
		self.enter(context, '');
		
		
		var node_jqo = null;
		
		// SELECT ANCHOR BY CONTENT
		var a_jqo = $('li>a:contains("' + arg_node_item_text + '"):eq(0)', self.items_jquery_parent);
		if ( ! a_jqo)
		{
			self.leave(context, self.msg_failure);
			return null;
		}
		
		// GET ANCHOR PARENT
		node_jqo = a_jqo.parent();
		
		
		self.leave(context, self.msg_success);
		return node_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptDropdown
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
		
		var ul_id = self.name + '_dropdown_ul_id';
		var direction = self.direction ? self.direction : 'bottom';
		
		self.a_jqo = $('<a>');
		self.content_jqo.append(self.a_jqo);
		self.a_jqo.attr('href', '#');
		self.a_jqo.html(self.label);
		self.a_jqo.attr('data-dropdown', ul_id);
		self.a_jqo.attr('data-options', 'align:' + direction);
		self.a_jqo.addClass('button dropdown');
		
		self.ul_jqo = $('<ul>');
		self.content_jqo.append(self.ul_jqo);
		self.ul_jqo.attr('id', ul_id);
		self.ul_jqo.attr('aria-autoclose', true);
		self.ul_jqo.attr('data-dropdown-content', '');
		self.ul_jqo.addClass('f-dropdown');
		
		self.items_jquery_parent = self.ul_jqo;
		
		
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptDropdown
	 * @desc				End the render of the container
	 * @return {nothing}
	 */
	var cb_render_end_self = function()
	{
		var self = this;
		var context = 'render_end_self()';
		self.enter(context, '');
		
		
		// INIT FOUNDATION DROPDONW PLUGIN
		self.content_jqo.foundation();
		
		
		self.leave(context, self.msg_success);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptDropdown
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
		
		// HANDLE CLICK
		node_jqo.click(
			function()
			{
				self.step(context, 'on click');
				
				var onclick = function()
				{
					self.step(context, 'on click callback');
					console.log('on click callback');
					try
					{
						var node_index = parseInt( node_jqo.index() );
						self.value(context, 'node_index', node_index);
						
						self.select(node_index);
						
						var current_label = node_jqo.text();
						var new_label = node_jqo.attr('devapt-label');
						if ( DevaptTypes.is_not_empty_str(new_label) && ! DevaptTypes.is_not_empty_str(current_label) )
						{
							self.a_jqo.text(new_label);
						}
					}
					catch(e)
					{
						console.error(e, context);
					}
				};
				
				try
				{
					var worker_promise = self.get_worker('default');
					worker_promise.then(
						function(worker)
						{
							// console.log(worker, 'worker');
							worker.once(onclick);
						}
					);
					
					// onclick();
				}
				catch(e)
				{
					console.error(e, context);
				}
				
				return true;
			}
		);
		
		
		self.leave(context, 'success');
		return node_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptDropdown
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
		
		
		self.leave(context, self.msg_success);
		return arg_item_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptDropdown
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
		
		var a_jqo = $('<a href="#">');
		a_jqo.html(arg_item_content);
		arg_item_jqo.append(a_jqo);
		
		self.leave(context, self.msg_success);
		return arg_item_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptDropdown
	 * @desc				Process event selected
	 * @param {array}		arg_event_operands		event operands array
	 * @return {nothing}
	 */
	var cb_on_selected_item_event = function(arg_event_operands)
	{
		var self = this;
		var context = 'on_selected_item_event(opds)';
		self.enter(context, '');
		
		
		// GET LABEL
		var selected_map = arg_event_operands[2];
		self.a_jqo.html(selected_map.label);
		
		
		self.leave(context, self.msg_success);
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-05-09',
			'updated':'2014-12-13',
			'description':'Container view class to display a dropdown menu of items.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptContainer;
	var DevaptDropdownClass = new DevaptClass('DevaptDropdown', parent_class, class_settings);
	
	// METHODS
	DevaptDropdownClass.infos.ctor = cb_constructor;
	DevaptDropdownClass.add_public_method('get_node_by_content', {}, cb_get_node_by_content);
	DevaptDropdownClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptDropdownClass.add_public_method('render_end_self', {}, cb_render_end_self);
	DevaptDropdownClass.add_public_method('render_item_node', {}, cb_render_item_node);
	DevaptDropdownClass.add_public_method('render_item_divider', {}, cb_render_item_divider);
	DevaptDropdownClass.add_public_method('render_item_text', {}, cb_render_item_text);
	DevaptDropdownClass.add_public_method('on_selected_item_event', {}, cb_on_selected_item_event);
	
	// PROPERTIES
	DevaptDropdownClass.add_public_str_property('direction',			'',	'bottom', false, false, ['view_direction']); // down, top, left, rigth
	
	
	return DevaptDropdownClass;
} );