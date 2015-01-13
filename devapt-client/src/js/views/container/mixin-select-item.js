/**
 * @file        views/mixin-select-item.js
 * @desc        Mixin for select feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class'],
function(Devapt, DevaptTypes, DevaptClass)
{
	/**
	 * @mixin				DevaptMixinSelectItem
	 * @public
	 * @desc				Mixin of methods for filtered feature for containers
	 */
	var DevaptMixinSelectItem = 
	{
		/**
		 * @memberof			DevaptMixinSelectItem
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_select_item: false,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinSelectItem
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_select_item: function(self)
		{
			self.push_trace(self.trace, DevaptMixinSelectItem.mixin_trace_select_item);
			var context = 'mixin_init_select_item()';
			self.enter(context, '');
			
			
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinSelectItem
		 * @desc				Process select record event
		 * @param {object}		arg_field_name				field name
		 * @param {object}		arg_field_value				field value
		 * @param {object}		arg_node_item_text			node item text
		 * @return {nothing}
		 */
		on_record_select: function(arg_field_name, arg_field_value, arg_node_item_text)
		{
			var self = this;
			var context = 'on_query_filters_event()';
			self.push_trace(self.trace, DevaptMixinSelectItem.mixin_trace_select_item);
			self.enter(context, '');
			
			
			// DEBUG
			// console.log(arg_field_value, 'on_record_select.' + arg_field_name);
			// console.log(arg_node_item_text, 'arg_node_item_text');
			
			
			// SELECT JQO NODE
			var node_jqo = null;
			if ( DevaptTypes.is_not_empty_str(arg_node_item_text) )
			{
				self.step(context, 'container item text is a valid string');
				
				node_jqo = self.get_node_by_content(arg_node_item_text);
			}
			else
			{
				self.step(context, 'container item text is not a valid string');
				
				node_jqo = self.get_node_by_field_value(arg_field_name, arg_field_value);
			}
			
			// CHECK NODE
			if ( ! node_jqo)
			{
				self.leave(context, self.msg_failure);
				self.pop_trace();
				return;
			}
			
			var node_index = parseInt( node_jqo.index() );
			var operands_map = {
				field_value:arg_field_value,
				field_name:arg_field_name
			};
			self.select_item_node(node_index, operands_map);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinSelectItem
		 * @desc				Select item node at index
		 * @param {integer} 	arg_item_index		item index
		 * @param {object} 		arg_event_opds		optional event operands map
		 * @return {nothing}
		 */
		select_item_node: function(arg_item_index, arg_event_opds)
		{
			var self = this;
			var context = 'select_item_node(index)';
			self.push_trace(self.trace, DevaptMixinSelectItem.mixin_trace_select_item);
			self.enter(context, '');
			
			
			// REMOVE PREVIOUS SELECTED ITEM
			self.remove_items_css_class('selected');
			
			// SELECT ITEM NODE AT GIVEN INDEX
			var node_jqo = $(self.items_jquery_filter, self.items_jquery_parent).eq(arg_item_index);
			
			// CHECK ITEM NODE
			if ( ! node_jqo)
			{
				self.error(context + ':node not found');
				self.leave(context, self.msg_failure);
				self.pop_trace();
				return;
			}
			
			// ENABLE SELECTED NODE
			node_jqo.addClass('selected');
			
			// GET SELECTION ATTRIBUTES
			var node_index = parseInt( node_jqo.index() );
			var node_value = node_jqo.text();
			var record = self.items_records[node_index];
			// console.log(self.items_records, context + ':self.items_records [' + self.name + ']');
			// console.log(record, context + ':record [' + self.name + ']');
			
			// BUILD EVENT OPERANDS MAP
			var event_opds_map = {
				index:node_index,
				label:node_value,
				record:record
			}
			if ( DevaptTypes.is_object(arg_event_opds) )
			{
				for(opds_key in arg_event_opds)
				{
					event_opds_map[opds_key] = arg_event_opds[opds_key];
				}
			}
			
			// SEND EVENT
			self.fire_event('devapt.events.container.selected', [event_opds_map]);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-23',
			'updated':'2014-12-06',
			'description':'Mixin methods for select feature for containers.'
		}
	};
	var DevaptMixinSelectItemClass = new DevaptClass('DevaptMixinSelectItem', null, class_settings);
	
	// METHODS
	DevaptMixinSelectItemClass.infos.ctor = DevaptMixinSelectItem.mixin_init_select_item;
	DevaptMixinSelectItemClass.add_public_method('on_record_select', {}, DevaptMixinSelectItem.on_record_select);
	DevaptMixinSelectItemClass.add_public_method('select_item_node', {}, DevaptMixinSelectItem.select_item_node);
	
	// PROPERTIES
	DevaptMixinSelectItemClass.add_public_bool_property('items_selectable',	'', true, false, false, []);
	
	// BUILD MIXIN CLASS
	DevaptMixinSelectItemClass.build_class();
	
	
	return DevaptMixinSelectItemClass;
}
);