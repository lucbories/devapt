/**
 * @file        backend-foundation5/containers/pgrid.js
 * @desc        Foundation 5 Position Grid class
 *				API:
 *					EVENTS:
 *						top-left-clicked
 *						top-center-clicked
 *						top-right-clicked
 *						center-left-clicked
 *						center-center-clicked
 *						center-right-clicked
 *						bottom-left-clicked
 *						bottom-center-clicked
 *						bottom-right-clicked
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-08-01
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
	 * @class				DevaptPGrid
	 * @desc				Position Grid view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptPGrid(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptContainer;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptPGrid';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptPGrid
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptPGrid_contructor = function()
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
		self.DevaptPGrid_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptPGrid
		 * @desc				Begin the render of the container
		 * @return {nothing}
		 */
		self.render_begin = function()
		{
			var self = this;
			var context = 'render_begin()';
			self.enter(context, '');
			
			
			// CREATE DIV ROW
			self.content_jqo = $('<div>');
			self.parent_jqo.append(self.content_jqo);
			self.content_jqo.addClass('row');
			self.content_jqo.addClass('devapt_row');
			
			// CREATE TOP ROW
			self.row_top_jqo = $('<div>');
			self.content_jqo.append(self.row_top_jqo);
			self.row_top_jqo.addClass('row');
			self.row_top_jqo.addClass('devapt_row');
			self.row_top_jqo.css('min-height', self.top_min_height);
			self.row_top_jqo.css('max-height', self.top_max_height);
			self.row_top_jqo.css('height', self.top_prefered_height);
			
			// CREATE TOP ROW
			self.row_center_jqo = $('<div>');
			self.content_jqo.append(self.row_center_jqo);
			self.row_center_jqo.addClass('row');
			self.row_center_jqo.addClass('devapt_row');
			self.row_center_jqo.css('min-height', self.center_min_height);
			self.row_center_jqo.css('max-height', self.center_max_height);
			self.row_center_jqo.css('height', self.center_prefered_height);
			
			// CREATE TOP ROW
			self.row_bottom_jqo = $('<div>');
			self.content_jqo.append(self.row_bottom_jqo);
			self.row_bottom_jqo.addClass('row');
			self.row_bottom_jqo.addClass('devapt_row');
			self.row_bottom_jqo.css('min-height', self.bottom_min_height);
			self.row_bottom_jqo.css('max-height', self.bottom_max_height);
			self.row_bottom_jqo.css('height', self.bottom_prefered_height);
			
			
			// INIT BLOCK WIDTHS
			var cols = null;
			var small_cols = null;
			var medium_cols = null;
			var large_cols = null;
			
			// ROW TOP CONTENT
			cols = self.top_left_columns;
			small_cols = cols;
			medium_cols = cols;
			large_cols = cols;
			self.top_left_jqo = $('<div top_left_jqo="">');
			self.row_top_jqo.append(self.top_left_jqo);
			self.top_left_jqo.addClass('small-' + small_cols + ' medium-' + medium_cols + ' large-' + large_cols + ' columns');
			self.top_left_jqo.click( function(event) { self.fire_event('top-left-clicked'); } );
			
			cols = self.top_center_columns;
			small_cols = cols;
			medium_cols = cols;
			large_cols = cols;
			self.top_center_jqo = $('<div top_center_jqo="">');
			self.row_top_jqo.append(self.top_center_jqo);
			self.top_center_jqo.addClass('small-' + small_cols + ' medium-' + medium_cols + ' large-' + large_cols + ' columns');
			self.top_left_jqo.click( function(event) { self.fire_event('top-center-clicked'); } );
			
			cols = self.top_right_columns;
			small_cols = cols;
			medium_cols = cols;
			large_cols = cols;
			self.top_right_jqo = $('<div top_right_jqo="">');
			self.row_top_jqo.append(self.top_right_jqo);
			self.top_right_jqo.addClass('small-' + small_cols + ' medium-' + medium_cols + ' large-' + large_cols + ' columns');
			self.top_left_jqo.click( function(event) { self.fire_event('top-right-clicked'); } );
			
			
			// ROW CENTER CONTENT
			cols = self.center_left_columns;
			small_cols = cols;
			medium_cols = cols;
			large_cols = cols;
			self.center_left_jqo = $('<div center_left_jqo="">');
			self.row_center_jqo.append(self.center_left_jqo);
			self.center_left_jqo.addClass('small-' + small_cols + ' medium-' + medium_cols + ' large-' + large_cols + ' columns');
			self.top_left_jqo.click( function(event) { self.fire_event('center-left-clicked'); } );
			
			cols = self.center_center_columns;
			small_cols = cols;
			medium_cols = cols;
			large_cols = cols;
			self.center_center_jqo = $('<div center_center_jqo="">');
			self.row_center_jqo.append(self.center_center_jqo);
			self.center_center_jqo.addClass('small-' + small_cols + ' medium-' + medium_cols + ' large-' + large_cols + ' columns');
			self.top_left_jqo.click( function(event) { self.fire_event('center-center-clicked'); } );
			
			cols = self.center_right_columns;
			small_cols = cols;
			medium_cols = cols;
			large_cols = cols;
			self.center_right_jqo = $('<div center_right_jqo="">');
			self.row_center_jqo.append(self.center_right_jqo);
			self.center_right_jqo.addClass('small-' + small_cols + ' medium-' + medium_cols + ' large-' + large_cols + ' columns');
			self.top_left_jqo.click( function(event) { self.fire_event('center-right-clicked'); } );
			
			
			// ROW BOTTOM CONTENT
			cols = self.bottom_left_columns;
			small_cols = cols;
			medium_cols = cols;
			large_cols = cols;
			self.bottom_left_jqo = $('<div bottom_left_jqo="">');
			self.row_bottom_jqo.append(self.bottom_left_jqo);
			self.bottom_left_jqo.addClass('small-' + small_cols + ' medium-' + medium_cols + ' large-' + large_cols + ' columns');
			self.top_left_jqo.click( function(event) { self.fire_event('bottom-left-clicked'); } );
			
			cols = self.bottom_center_columns;
			small_cols = cols;
			medium_cols = cols;
			large_cols = cols;
			self.bottom_center_jqo = $('<div bottom_center_jqo="">');
			self.row_bottom_jqo.append(self.bottom_center_jqo);
			self.bottom_center_jqo.addClass('small-' + small_cols + ' medium-' + medium_cols + ' large-' + large_cols + ' columns');
			self.top_left_jqo.click( function(event) { self.fire_event('bottom-center-clicked'); } );
			
			cols = self.bottom_right_columns;
			small_cols = cols;
			medium_cols = cols;
			large_cols = cols;
			self.bottom_right_jqo = $('<div bottom_right_jqo="">');
			self.row_bottom_jqo.append(self.bottom_right_jqo);
			self.bottom_right_jqo.addClass('small-' + small_cols + ' medium-' + medium_cols + ' large-' + large_cols + ' columns');
			self.top_left_jqo.click( function(event) { self.fire_event('bottom-right-clicked'); } );
			
			
			self.leave(context, 'success');
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPGrid
		 * @desc				Render an empty item node
		 * @param {integer} 	arg_item_index		item index
		 * @return {object}		jQuery object node
		 */
		self.render_item_node = function(arg_item_index)
		{
			var self = this;
			var context = 'render_item_node(index)';
			self.enter(context, '');
			
			
			var new_item = $('<div>');
			
			
			self.leave(context, 'success');
			return new_item;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPGrid
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
			
			
			var arg_item_index = arg_item_record.index;
			var position = self.items_positions[self.items_positions.length - 1];
			if (self.items_positions.length > arg_item_index)
			{
				position = self.items_positions[arg_item_index];
			}
			
			var node_jqo = null;
			switch(position)
			{
				// TOP ROW POSITIONS
				case 'top-left':
				case 'tl':
					node_jqo = self.top_left_jqo;
					break;
				case 'top-center':
				case 'tc':
					node_jqo = self.top_center_jqo;
					break;
				case 'top-right':
				case 'tr':
					node_jqo = self.top_right_jqo;
					break;
				
				// CENTER ROW POSITIONS
				case 'center-left':
				case 'cl':
					node_jqo = self.center_left_jqo;
					break;
				case 'center-center':
				case 'cc':
					node_jqo = self.center_center_jqo;
					break;
				case 'center-right':
				case 'cr':
					node_jqo = self.center_right_jqo;
					break;
				
				// BOTTOM ROW POSITIONS
				case 'bottom-left':
				case 'bl':
					node_jqo = self.bottom_left_jqo;
					break;
				case 'bottom-center':
				case 'bc':
					node_jqo = self.bottom_center_jqo;
					break;
				case 'bottom-right':
				case 'br':
					node_jqo = self.bottom_right_jqo;
					break;
				
				// DEFAULT POSITION
				default:
					node_jqo = self.center_center_jqo;
					break;
			}
			
			node_jqo.append(arg_item_jqo);
			
			
			self.leave(context, self.msg_success);
			return true;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptPGrid, ['DevaptContainer'], 'Luc BORIES', '2014-05-09', 'Simple view class to display a list of items.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_int_option(DevaptPGrid, 'top_left_columns', 4, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'center_left_columns', 4, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'bottom_left_columns', 4, false, []);
	
	DevaptOptions.register_int_option(DevaptPGrid, 'top_center_columns', 4, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'center_center_columns', 4, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'bottom_center_columns', 4, false, []);
	
	DevaptOptions.register_int_option(DevaptPGrid, 'top_right_columns', 4, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'center_right_columns', 4, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'bottom_right_columns', 4, false, []);
	
	
	DevaptOptions.register_int_option(DevaptPGrid, 'top_min_height', 100, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'center_min_height', 100, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'bottom_min_height', 100, false, []);
	
	DevaptOptions.register_int_option(DevaptPGrid, 'top_prefered_height', 100, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'center_prefered_height', 100, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'bottom_prefered_height', 100, false, []);
	
	DevaptOptions.register_int_option(DevaptPGrid, 'top_max_height', 200, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'center_max_height', 200, false, []);
	DevaptOptions.register_int_option(DevaptPGrid, 'bottom_max_height', 200, false, []);
	
	DevaptOptions.register_option(DevaptContainer, {
			name: 'items_positions',
			type: 'array',
			aliases: ['view_items_positions'],
			default_value: ['center'],
			array_separator: ',',
			array_type: 'String',
			format: '',
			is_required: false,
			childs: {}
		}
	); // top-left/tl, top-center/tc, top-right/tr, center-left/cl, center-center/cc, center-right/cr, bottom-left/bl, bottom-center/bc, bottom-right/br
	
	
	return DevaptPGrid;
} );