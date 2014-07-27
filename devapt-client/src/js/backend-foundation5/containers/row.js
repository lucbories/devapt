/**
 * @file        backend-foundation5/views/row.js
 * @desc        Foundation 5 row class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'views/container', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptContainer, undefined)
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
	function DevaptRow(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptContainer;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptRow';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptRow
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptRow_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var context = self.class_name + '(' + arg_name + ')';
			self.enter(context, 'constructor');
			
			
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
		self.DevaptRow_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptList
		 * @desc				Begin the render of the container
		 * @return {nothing}
		 */
		self.render_begin = function()
		{
			var self = this;
			var context = 'render_begin()';
			self.enter(context, '');
			
			
			self.content_jqo = $('<div>');
			self.content_jqo.addClass('row');
			self.content_jqo.addClass('devapt_row');
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
			
			
			var node_jqo = $('<div>');
			var item_options = self.get_item_options(arg_item_index, { columns:1, small_columns:1, medium_columns:1, large_columns:1, centered:false });
			
			var item_columns = DevaptTypes.is_integer(item_options.columns) ? item_options.columns : 1;
			var item_small_columns = DevaptTypes.is_integer(item_options.small_columns) ? item_options.small_columns : item_columns;
			var item_medium_columns = DevaptTypes.is_integer(item_options.medium_columns) ? item_options.medium_columns : item_columns;
			var item_large_columns = DevaptTypes.is_integer(item_options.large_columns) ? item_options.large_columns : item_columns;
			
			node_jqo.addClass('small-' + item_small_columns + ' medium-' + item_medium_columns + ' large-' + item_large_columns + ' columns');
			
			
			self.leave(context, 'success');
			return node_jqo;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptRow, ['DevaptContainer'], 'Luc BORIES', '2014-07-26', 'View container class to display a row of columns (max=12).');
	
	
	// INTROSPETION : REGISTER OPTIONS
	
	
	
	return DevaptRow;
} );