/**
 * @file        views/container/container-mixin-items.js
 * @desc        Mixin for container items operations
 * 				API
 * 					->mixin_item_init(self): init mixin attributes (nothing)
 * 					->new_item(settings): Create an empty container item or an item with given attributes (plain object)
 * 					->update_item_type(arg_container_item): Update a container item type and content with predefined values (boolean)
 * 					
 * 					->append_item(arg_container_item): Append a container item to the container collection (boolean)
 * 					->insert_item(arg_container_item): Insert a container item into the container collection at the given index (boolean)
 * 					->remove_item(arg_container_item): Remove a container item from the container collection (boolean)
 * 					->render_item(arg_container_item): Render the container item content into the view for the first time (promise object)
 * 					->update_item(arg_container_item): Update the view with the container item content (boolean)
 * 					
 * 					->get_item_by_index(arg_index): Get an existing container item with its index (plain object)
 * 					->get_item_by_id(arg_id): Get an existing container item with its id (plain object)
 * @see			DevaptContainers
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-06-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class'],
function(Devapt, DevaptTypes, DevaptClass)
{
	/**
	 * @mixin				DevaptMixinItems
	 * @public
	 * @desc				Mixin for container items operations
	 */
	var DevaptMixinItems = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinItems
		 * @desc				Init mixin
		 * @param {object}		self		Container instance
		 * @return {nothing}
		 */
		mixin_items_init: function(self)
		{
			var context = 'mixin_items_init(self)';
			self.enter(context, '');
			
			
			self.mixin_items_collection_by_index = [];
			self.mixin_items_collection_by_id = {};
			
			
			self.leave(context, Devapt.msg_success);
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinItems
		 * @desc				Create an empty container item or an item with given attributes
		 * @param {object}		arg_settings		A plain object of item attributes (optional)
		 * @return {object}		A plain object
		 */
		new_item: function(arg_settings)
		{
			var self = this;
			var context = 'new_item(settings)';
			self.enter(context, '');
			
			
			var container_item = {
				is_container_item:true,
				
				id:null,
				index: null,
				item_type: null,
				
				is_active:false,
				is_selected:false,
				
				position: false, // UNUSED
				width: false, // UNUSED
				heigth: false, // UNUSED
				
				node: null,
				content: null
			};
			
			if (DevaptTypes.is_plain_object(arg_settings))
			{
				container_item = window.$.extend({}, container_item, arg_settings);
			}
			
			
			self.leave(context, Devapt.msg_success);
			return container_item;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinItems
		 * @desc				Update a container item type and content with predefined values
		 * @param {object}		arg_container_item		A plain object of a container item
		 * @return {boolean}
		 */
		update_item_type: function(arg_container_item)
		{
			var self = this;
			var context = 'update_item_type(item)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			self.assert_object(context, 'item', arg_container_item);
			self.assert_true(context, 'item.is_container_item', arg_container_item.is_container_item);
			
			// DIVIDER
			if (arg_container_item.content === 'divider')
			{
				arg_container_item.item_type = 'divider';
			}
			
			// VIEW
			else if ( arg_container_item.item_type === 'view' && DevaptTypes.is_object(arg_container_item.content) && arg_container_item.content.value )
			{
				arg_container_item.content = arg_container_item.content.value;
			}
			
			// NO GIVEN TYPES
			else if ( DevaptTypes.is_null(arg_container_item.item_type) )
			{
				if ( DevaptTypes.is_array(arg_container_item.content) )
				{
					arg_container_item.item_type = 'array';
				}
				else if ( DevaptTypes.is_plain_object(arg_container_item.content) )
				{
					arg_container_item.item_type = 'plain_object';
				}
				else if ( DevaptTypes.is_object(arg_container_item.content) && arg_container_item.content.is_record )
				{
					arg_container_item.item_type = 'DevaptRecord';
				}
				else
				{
					self.leave(context, Devapt.msg_failure);
					return false;
				}
			}
			
			
			self.leave(context, Devapt.msg_success);
			return true;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinItems
		 * @desc				Append a container item to the container collection
		 * @param {object}		arg_container_item		A plain object of a container item
		 * @return {boolean}
		 */
		append_item: function(arg_container_item)
		{
			var self = this;
			var context = 'append_item(item)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			self.assert_object(context, 'item', arg_container_item);
			self.assert_true(context, 'item.is_container_item', arg_container_item.is_container_item);
			
			// UPDATE TYPE
			if (! self.update_item_type(arg_container_item) )
			{
				self.leave(context, Devapt.msg_failure);
				return false;
			}
			
			// CHECK AND UPDATE ID
			if (! arg_container_item.id)
			{
				arg_container_item.id = 'id_' + Devapt.uid();
			}
			if (arg_container_item.id in self.mixin_items_collection_by_id)
			{
				self.leave(context, Devapt.msg_failure);
				return false;
			}
			
			// CHECK AND UPDATE INDEX
			arg_container_item.index = self.mixin_items_collection_by_index.length;
			self.assert_true(context, 'array.length === map.length', self.mixin_items_collection_by_index.length === self.mixin_items_collection_by_index.length);
			
			// APPEND ITEM IN ITEMS COLLECTION
			self.mixin_items_collection_by_index.push(arg_container_item);
			// self.items_records_count = self.items_records.length;
			self.mixin_items_collection_by_id[arg_container_item.id] = arg_container_item;
			
			
			self.leave(context, Devapt.msg_success);
			return true;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinItems
		 * @desc				Insert a container item into the container collection at the given index
		 * @param {object}		arg_container_item		A plain object of a container item
		 * @return {boolean}
		 */
		insert_item: function(arg_container_item)
		{
			var self = this;
			var context = 'insert_item(item)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			self.assert_object(context, 'item', arg_container_item);
			self.assert_true(context, 'item.is_container_item', arg_container_item.is_container_item);
			self.assert_not_empty_string(context, 'item.id', arg_container_item.id);
			self.assert_integer(context, 'item.index', arg_container_item.index);
			self.assert_true(context, 'item index >= 0', arg_container_item.index >= 0);
			
			// APPEND AT END
			if (arg_container_item.index >= self.mixin_items_collection_by_index.length)
			{
				self.leave(context, Devapt.msg_success);
				return self.append_item(arg_container_item);
			}
			
			// UPDATE TYPE
			if (! self.update_item_type(arg_container_item) )
			{
				self.leave(context, Devapt.msg_failure);
				return false;
			}
			
			// CHECK AND UPDATE ID
			if (! arg_container_item.id)
			{
				arg_container_item.id = 'id_' + Devapt.uid();
			}
			if (arg_container_item.id in self.mixin_items_collection_by_id)
			{
				self.leave(context, Devapt.msg_failure);
				return false;
			}
			
			// INSERT ITEM INTO ITEMS COLLECTION
			var split_index = arg_container_item.index -1;
			var begin = self.mixin_items_collection_by_index.slice(0, split_index);
			var end = self.mixin_items_collection_by_index.slice(split_index);
			begin.push(arg_container_item);
			self.mixin_items_collection_by_index = begin.concat(end);
			self.mixin_items_collection_by_id[arg_container_item.id] = arg_container_item;
			
			// UPDATE ITEM INDEX
			var loop_index = split_index;
			while(loop_index < self.mixin_items_collection_by_index.length)
			{
				self.mixin_items_collection_by_index[loop_index].index = loop_index;
				++loop_index;
			}
			
			
			self.leave(context, Devapt.msg_success);
			return true;
		},
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinItems
		 * @desc					Render the container item content into the view for the first time
		 * @param {plain object}	arg_container_item		A plain object of a container item
		 * @return {promise object}
		 */
		render_item: function(arg_container_item)
		{
			var self = this;
			var context = 'render_item(item)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			console.debug(arg_container_item, context + '.arg_container_item');
			// console.debug(arg_container_item.index, context + '.arg_container_item.index');
			self.assert_object(context, 'item', arg_container_item);
			self.assert_true(context, 'item.is_container_item', arg_container_item.is_container_item);
			self.assert_not_empty_string(context, 'item.id', arg_container_item.id);
			self.assert_integer(context, 'item.index', arg_container_item.index);
			self.assert_true(context, 'item index >= 0', arg_container_item.index >= 0);
			
			var arg_deferred = Devapt.defer();
			var node_jqo = arg_container_item.node;
			var arg_item_content = arg_container_item.content;
			
			// FILL ITEM NODE
			switch(arg_container_item.item_type)
			{
				case 'divider':
				{
					if ( ! self.has_divider )
					{
						self.leave(context, 'bad divider item');
						return false;
					}
					self.assert_function(context, 'self.render_item_divider', self.render_item_divider);
					node_jqo = self.render_item_divider(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'html':
				{
					self.assert_function(context, 'self.render_item_html', self.render_item_html);
					node_jqo = self.render_item_html(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'text':
				{
					self.assert_function(context, 'self.render_item_text', self.render_item_text);
					// console.log(node_jqo, context + ':node_jqo text before:' + self.name + ' for ' + arg_item_content);
					node_jqo = self.render_item_text(arg_deferred, node_jqo, arg_item_content);
					// console.log(node_jqo, context + ':node_jqo text after:' + self.name + ' for ' + arg_item_content);
					break;
				}
				case 'view':
				{
					self.step(context, 'render a view');
					self.value(context, 'arg_item_content', arg_item_content);
					
					try
					{
						self.assert_function(context, 'self.render_item_view', self.render_item_view);
						
						var view_promise = self.render_item_view(arg_deferred, node_jqo, arg_item_content);
						// console.log(node_jqo, context + ':node_jqo view after:' + self.name + ' for ' + arg_item_content);
					}
					catch(e)
					{
						console.error(e, context + ':view');
					}
					
					break;
				}
				case 'record':
				case 'object':
				case 'plain_object':
				{
					self.assert_function(context, 'self.render_item_object', self.render_item_object);
					arg_item_content.container_item_index = arg_container_item.index;
					node_jqo = self.render_item_object(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'array':
				{
					self.assert_function(context, 'self.render_item_array', self.render_item_array);
					
					// ITEM RECORD
					var values_array = arg_item_content;
					if ( DevaptTypes.is_string(arg_item_content) )
					{
						values_array = arg_item_content.split('|', arg_item_content);
					}
					
					if ( ! DevaptTypes.is_array(values_array) )
					{
						break;
					}
					
					node_jqo = self.render_item_array(arg_deferred, node_jqo, values_array);
					break;
				}
				case 'callback':
				{
					self.assert_function(context, 'self.render_item_callback', self.render_item_callback);
					node_jqo = self.render_item_callback(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				default:
				{
					self.error('bad item type [' + arg_container_item.item_type + '] for [' + self.name + ']');
					self.leave(context, Devapt.msg_failure);
					return Devapt.promise_rejected();
				}
			}
			
			arg_container_item.node = node_jqo;
			
			self.leave(context, Devapt.msg_success);
			return Devapt.promise_resolved();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinItems
		 * @desc				Remove a container item from the container collection
		 * @param {object}		arg_container_item		A plain object of a container item
		 * @return {boolean}
		 */
		remove_item: function(arg_container_item)
		{
			var self = this;
			var context = 'remove_item(item)';
			self.enter(context, '');
			// TODO
			self.leave(context, Devapt.msg_success);
			return true;
		},
		
		
		
		/* --------------------------------------------- LOOKUP OPERATIONS ------------------------------------------------ */
		
		/**
		 * @public
		 * @memberof			DevaptMixinItems
		 * @desc				Get an existing container item with its index
		 * @param {integer}		arg_index		A container index
		 * @return {plain object}
		 */
		get_item_by_index: function(arg_index)
		{
			var self = this;
			var context = 'get_item_by_index(index)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			self.assert_integer(context, 'arg_index', arg_index);
			self.assert_true(context, 'arg_index >= 0', arg_index >= 0);
			self.assert_true(context, 'arg_index < length', arg_index < self.mixin_items_collection_by_index.length);
			
			// LOOKUP ITEM IN ITEMS COLLECTION
			var container_item = self.mixin_items_collection_by_index[arg_index];
			
			
			self.leave(context, Devapt.msg_found);
			return container_item;
		},
		
		/**
		 * @public
		 * @memberof			DevaptMixinItems
		 * @desc				Get an existing container item with its id
		 * @param {string}		arg_id		A container item unique identifier
		 * @return {plain object}
		 */
		get_item_by_id: function(arg_id)
		{
			var self = this;
			var context = 'get_item_by_id(id)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			self.assert_not_empty_string(context, 'arg_id', arg_id);
			self.assert_true(context, 'arg_id is map key', arg_id in self.mixin_items_collection_by_id);
			
			// LOOKUP ITEM IN ITEMS COLLECTION
			var container_item = self.mixin_items_collection_by_id[arg_id];
			
			
			self.leave(context, Devapt.msg_found);
			return container_item;
		},
		
		/**
		 * @public
		 * @memberof			DevaptMixinItems
		 * @desc				Get an existing container item with its id
		 * @param {string}		arg_id		A container item unique identifier
		 * @return {plain object}
		 */
		get_item_by_label: function(arg_label)
		{
			var self = this;
			var context = 'get_item_by_id(label)';
			self.enter(context, '');
			
			
			// CHECK ARGS
			self.assert_not_empty_string(context, 'arg_label', arg_label);
			
			// LOOKUP ITEM IN ITEMS COLLECTION
			var loop_index = 0;
			var loop_item = null;
			var loop_label = null;
			while(loop_index < self.mixin_items_collection_by_index.length)
			{
				loop_item = self.mixin_items_collection_by_index[loop_index];
				loop_label = self.get_item_node_text(loop_item.node);
				if (arg_label === loop_label)
				{
					self.leave(context, Devapt.msg_found);
					return loop_item;
				}
				++loop_index;
			}
			
			
			self.leave(context, Devapt.msg_not_found);
			return null;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-06-23',
			'updated':'2015-06-23',
			'description':'Mixin for container items operations.'
		}
	};
	var DevaptMixinItemsClass = new DevaptClass('DevaptMixinItems', null, class_settings);
	
	// METHODS
	DevaptMixinItemsClass.infos.ctor = DevaptMixinItems.mixin_items_init;
	DevaptMixinItemsClass.add_public_method('new_item', {}, DevaptMixinItems.new_item);
	DevaptMixinItemsClass.add_public_method('update_item_type', {}, DevaptMixinItems.update_item_type);
	
	DevaptMixinItemsClass.add_public_method('append_item', {}, DevaptMixinItems.append_item);
	DevaptMixinItemsClass.add_public_method('insert_item', {}, DevaptMixinItems.insert_item);
	DevaptMixinItemsClass.add_public_method('render_item', {}, DevaptMixinItems.render_item);
	DevaptMixinItemsClass.add_public_method('remove_item', {}, DevaptMixinItems.remove_item);
	
	DevaptMixinItemsClass.add_public_method('get_item_by_index', {}, DevaptMixinItems.get_item_by_index);
	DevaptMixinItemsClass.add_public_method('get_item_by_id', {}, DevaptMixinItems.get_item_by_id);
	DevaptMixinItemsClass.add_public_method('get_item_by_label', {}, DevaptMixinItems.get_item_by_label);
	
	// PROPERTIES
	
	// BUILD MIXIN CLASS
	DevaptMixinItemsClass.build_class();
	
	
	return DevaptMixinItemsClass;
}
);