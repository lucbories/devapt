/**
 * @file        backend-foundation5/containers/table.js
 * @desc        Foundation 5 list class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-07-27
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
	 * @class				DevaptTable
	 * @desc				Table view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptTable(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptContainer;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptTable';
		self.is_view			= true;
		
		self.table_header_jqo	= null;
		self.table_body_jqo		= null;
		self.has_divider		= false;
		
		self.items_jquery_parent = null;
		self.items_jquery_filter = 'tr';
		
		
		/**
		 * @public
		 * @memberof			DevaptTable
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptTable_contructor = function()
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
		self.DevaptTable_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptTable
		 * @desc				Get a container item node by the node item text
		 * @param {string}		arg_node_item_text		node item text
		 * @return {object}		node jQuery object
		 */
		self.get_node_by_content = function(arg_node_item_text)
		{
			var self = this;
			var context = 'get_node_by_content(text)';
			self.enter(context, '');
			
			
			// SELECT ANCHOR BY CONTENT
			var node_jqo = $('tr:contains("' + arg_node_item_text + '"):eq(0)', self.items_jquery_parent);
			if ( ! node_jqo)
			{
				self.leave(context, self.msg_failure);
				return null;
			}
			
			
			self.leave(context, self.msg_success);
			return node_jqo;
		}
		
		
		
		/**
		 * @public
		 * @memberof			DevaptTable
		 * @desc				Begin the render of the container
		 * @return {nothing}
		 */
		self.render_begin = function()
		{
			var self = this;
			var context = 'render_begin()';
			self.enter(context, '');
			
			
			self.content_jqo = $('<table>');
			self.parent_jqo.append(self.content_jqo);
			
			self.table_header_jqo = $('<thead>');
			self.content_jqo.append(self.table_header_jqo);
			
			self.table_body_jqo = $('<tbody>');
			self.content_jqo.append(self.table_body_jqo);
			
			self.table_footer_jqo = $('<tfoot>');
			self.content_jqo.append(self.table_footer_jqo);
			
			// HEADERS
			if ( DevaptTypes.is_array(self.items_labels) )
			{
				var tr_jqo = $('<tr>');
				self.table_header_jqo.append(tr_jqo);
				
				var col_index = 0;
				for(;col_index < self.items_labels.length ; ++col_index)
				{
					var th_jqo = $('<th>');
					var col_label = self.items_labels[col_index];
					th_jqo.html(col_label);
					tr_jqo.append(th_jqo);
				}
			}
			
			self.items_jquery_parent = self.table_body_jqo;
			
			
			self.leave(context, 'success');
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptTable
		 * @desc				Render an empty item node
		 * @param {integer} 	arg_item_index		item index
		 * @return {object}		jQuery object node
		 */
		self.render_item_node = function(arg_item_index)
		{
			var self = this;
			var context = 'render_item_node(index)';
			self.enter(context, '');
			
			
			var node_jqo = $('<tr>');
			node_jqo.click(
				function()
				{
					var node_index = parseInt( node_jqo.index() );
					self.select_item_node(node_index);
				}
			);
			
			
			self.leave(context, 'success');
			return node_jqo;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptTable
		 * @desc				Render an item RECORD content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		item jQuery object node
		 * @param {array}		arg_item_object		item object content
		 * @return {object}		jQuery object node
		 */
		self.render_item_object = function(arg_deferred, arg_item_jqo, arg_item_object)
		{
			var self = this;
			var context = 'render_item_object(deferred,jqo,content)';
			self.enter(context, '');
			
			
			// CHECK RECORD
			var record = arg_item_object;
			self.assertNotNull(context, 'record', record);
			self.value(context, 'record', record);
			
			// ASSERT NODE
			var tr_jqo = arg_item_jqo;
			self.assertNotNull(context, 'tr_jqo', tr_jqo);
			
			
			// LOOP ON FIELDS
			for(field_index in self.items_fields)
			{
				var field_name = self.items_fields[field_index];
				var field_value = record[field_name];
				var field_jqo = $('<td>');
				field_jqo.html(field_value);
				tr_jqo.append(field_jqo);
			}
			
			// ATTACH RECORD
			arg_item_jqo.data('record', arg_item_object);
			
			
			self.leave(context, self.msg_success);
			return arg_item_jqo;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptTable, ['DevaptContainer'], 'Luc BORIES', '2014-07-27', 'Tabs panel view class, horizontally (default), vertically (is_vertical:true).');
	
	
	// INTROSPETION : REGISTER OPTIONS
	// DevaptOptions.register_bool_option(DevaptTable, 'is_vertical',	false, false, []);
	
	
	return DevaptTable;
} );