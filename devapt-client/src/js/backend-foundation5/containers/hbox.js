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
['Devapt', 'core/types', 'core/options', 'core/classes', 'views/container', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptOptions, DevaptClasses, DevaptContainer, undefined)
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
	function DevaptHBox(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptContainer;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptHBox';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptHBox
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptHBox_contructor = function()
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
		self.DevaptHBox_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptHBox
		 * @desc				Begin the render of the container
		 * @return {nothing}
		 */
		self.render_begin = function()
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
			
			
			self.leave(context, 'success');
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptList
		 * @desc				Render an empty item node
		 * @param {integer} 	arg_item_index		item index
		 * @return {object}		jQuery object node
		 */
		self.render_item_node = function(arg_item_index)
		{
			var self = this;
			var context = 'render_item_node(index)';
			self.enter(context, '');
			
			var li_jqo = $('<li>');
			
			self.leave(context, 'success');
			return li_jqo;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptHBox, ['DevaptContainer'], 'Luc BORIES', '2014-05-09', 'Simple view class to display a list of items.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_int_option(DevaptHBox, 'small_device_blocks', 2, false, []);
	DevaptOptions.register_int_option(DevaptHBox, 'medium_device_blocks', 4, false, []);
	DevaptOptions.register_int_option(DevaptHBox, 'large_device_blocks', 6, false, []);
	
	
	return DevaptHBox;
} );