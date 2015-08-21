/**
 * @file        plugins/backend-foundation5/containers/table.js
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
	 * @class				DevaptTable
	 * @desc				Table view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptTable
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// DEBUG
		self.trace = true;
		
		// CONSTRUCTOR BEGIN
		var context = 'DevaptTable.constructor(' + self.name + ')';
		self.enter(context, '');
		
		
		// DEBUG
		// self.trace = true;
		// console.log(self.parent_jqo === null, 'parent is null?');
		
		self.table_header_jqo	= null;
		self.table_body_jqo		= null;
		self.has_divider		= false;
		
		self.items_jquery_parent = null;
		self.items_jquery_filter = 'tr';
		
		// self.add_event_callback('devapt.events.container.selected', [self, self.on_selected_item_event], false);
		
		
		// CONSTRUCTOR END
		self.leave(context, 'success');
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptTable
	 * @desc				Get a container item node by the node item text
	 * @param {string}		arg_node_item_text		node item text
	 * @return {object}		node jQuery object
	 */
	var cb_get_node_by_content = function(arg_node_item_text)
	{
		var self = this;
		var context = 'get_node_by_content(text)';
		self.enter(context, '');
		
		
		// SELECT ANCHOR BY CONTENT
		var node_jqo = $('tr:contains("' + arg_node_item_text + '"):eq(0)', self.items_jquery_parent);
		if ( ! node_jqo)
		{
			self.leave(context, Devapt.msg_failure);
			return null;
		}
		
		
		self.leave(context, Devapt.msg_success);
		return node_jqo;
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptTable
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
		
		self.table_jqo = $('<table>');
		self.content_jqo.append(self.table_jqo);
		
		self.table_header_jqo = $('<thead>');
		self.table_jqo.append(self.table_header_jqo);
		
		self.table_body_jqo = $('<tbody>');
		self.table_jqo.append(self.table_body_jqo);
		
		self.table_footer_jqo = $('<tfoot>');
		self.table_jqo.append(self.table_footer_jqo);
		
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
	var cb_render_item_node = function(arg_item_index)
	{
		var self = this;
		var context = 'render_item_node(index)';
		self.enter(context, '');
		
		
		var node_jqo = $('<tr>');
		node_jqo.click(
			function()
			{
				var node_index = parseInt( node_jqo.index() );
				
				// TODO
				self.select(node_index);
			}
		);
		
		
		self.leave(context, 'success');
		return node_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinRenderItems
	 * @desc				Render an empty record node for the container item
	 * @param {object}		arg_item_jqo		item node
	 * @return {object}		jQuery object node
	 */
	var cb_render_item_record_node = function(arg_item_jqo)
	{
		var self = this;
		var context = 'render_item_record_node(item node)';
		self.enter(context, '');
		
		// NOTHING TO DO
		
		self.leave(context, Devapt.msg_success);
		return arg_item_jqo;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinRenderItems
	 * @desc				Render an empty record field node for the container item
	 * @param {object}		arg_item_jqo		item node
	 * @return {object}		jQuery object node
	 */
	var cb_render_item_field_node = function(arg_item_jqo)
	{
		var self = this;
		var context = 'render_item_field_node(item node)';
		self.enter(context, '');
		
		var td_jqo = $('<td>');
		arg_item_jqo.append(td_jqo);
		
		self.leave(context, Devapt.msg_success);
		return td_jqo;
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
/*	var cb_render_item_object = function(arg_deferred, arg_item_jqo, arg_item_object)
	{
		var self = this;
		var context = 'render_item_object(deferred,jqo,content)';
		self.enter(context, '');
		
		
		// CHECK RECORD
		var record = arg_item_object;
		self.assert_not_null(context, 'record', record);
		self.value(context, 'record', record);
		
		// ASSERT NODE
		var tr_jqo = arg_item_jqo;
		self.assert_not_null(context, 'tr_jqo', tr_jqo);
		
		
		// LOOP ON FIELDS
		for(var field_index in self.items_fields)
		{
			var field_name = self.items_fields[field_index];
			var field_value = record[field_name];
			var field_jqo = $('<td>');
			field_jqo.html(field_value);
			tr_jqo.append(field_jqo);
		}
		
		// ATTACH RECORD
		arg_item_jqo.data('record', arg_item_object);
		
		
		self.leave(context, Devapt.msg_success);
		return arg_item_jqo;
	}*/
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-27',
			'updated':'2015-03-28',
			'description':'Container view class to display a table of items.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptContainer;
	var DevaptTableClass = new DevaptClass('DevaptTable', parent_class, class_settings);
	
	// METHODS
	DevaptTableClass.infos.ctor = cb_constructor;
	DevaptTableClass.add_public_method('get_node_by_content', {}, cb_get_node_by_content);
	DevaptTableClass.add_public_method('render_begin', {}, cb_render_begin);
	DevaptTableClass.add_public_method('render_item_node', {}, cb_render_item_node);
	DevaptTableClass.add_public_method('render_item_record_node', {}, cb_render_item_record_node);
	DevaptTableClass.add_public_method('render_item_field_node', {}, cb_render_item_field_node);
	// DevaptTableClass.add_public_method('render_item_object', {}, cb_render_item_object);
	
	// PROPERTIES
	
	
	return DevaptTableClass;
} );