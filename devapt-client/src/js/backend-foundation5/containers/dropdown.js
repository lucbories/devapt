/**
 * @file        backend-foundation5/containers/dropdown.js
 * @desc        Foundation 5 dropdown class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-08-05
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/options', 'core/classes', 'views/container', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptOptions, DevaptClasses, DevaptContainer, undefined)
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
	function DevaptDropdown(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptContainer;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptDropdown';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptDropdown
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptDropdown_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = 'contructor(' + arg_name + ')';
			self.enter(context, '');
			
			
			// INIT OPTIONS
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			if (! init_option_result)
			{
				self.error(context + ': init options failure');
			}
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CONTRUCT INSTANCE
		self.DevaptDropdown_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptDropdown
		 * @desc				Begin the render of the container
		 * @return {nothing}
		 */
		self.render_begin = function()
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
			self.ul_jqo.attr('data-dropdown-content', '');
			self.ul_jqo.addClass('f-dropdown');
			
			
			self.leave(context, 'success');
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptContainer
		 * @desc				End the render of the container
		 * @return {nothing}
		 */
		self.render_end = function()
		{
			var self = this;
			var context = 'render_end()';
			self.enter(context, '');
			
			
			// INIT FOUNDATION
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
		self.render_item_node = function(arg_item_index)
		{
			var self = this;
			var context = 'render_item_node(index)';
			self.enter(context, '');
			
			var node_jqo = $('<li>');
			
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
		self.render_item_divider = function(arg_deferred, arg_item_jqo, arg_item_content)
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
		self.render_item_text = function(arg_deferred, arg_item_jqo, arg_item_content)
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
		 * @desc				Append an item to the view
		 * @param {object}		arg_item_jqo		item jQuery object
		 * @param {object}		arg_item_record		item record
		 * @return {nothing}
		 */
		self.append_item_node = function(arg_item_jqo, arg_item_record)
		{
			var self = this;
			var context = 'append_item_node(item node, record)';
			self.enter(context, '');
			
			
			self.ul_jqo.append(arg_item_jqo);
			
			
			// HANDLE CLICK
			arg_item_jqo.click(
				function()
				{
					self.fire_event('devapt.dropdown.item.clicked', [arg_item_jqo]);
					console.log(arg_item_jqo, 'dropdown item fired');
					self.ul_jqo.toggle('open');
				}
			);
			
			
			self.leave(context, self.msg_success);
			return true;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptDropdown, ['DevaptContainer'], 'Luc BORIES', '2014-05-09', 'Simple view class to display a list of items.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptDropdown, 'direction',		'bottom', false, ['view_direction']); // down, top, left, rigth
	
	
	return DevaptDropdown;
} );