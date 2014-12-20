/**
 * @file        views/mixin-render-items.js
 * @desc        Mixin for datas items rendering feature for containers
 * @see			DevaptMixinRenderItems
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class', 'core/template'],
function(Devapt, DevaptTypes, DevaptClass, DevaptTemplate)
{
	/**
	 * @mixin				DevaptMixinRenderItems
	 * @public
	 * @desc				Mixin of methods for datas items rendering features
	 */
	var DevaptMixinRenderItems = 
	{
		/**
		 * @memberof			DevaptMixinRenderItems
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_render_items: true,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_render_items: function(self)
		{
			// var self = this;
			self.push_trace(self.trace, self.mixin_trace_render_items);
			var context = 'mixin_init_render_items()';
			self.enter(context, '');
			
			
			
			
			self.leave(context, '');
			self.pop_trace();
		},
			
		
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an empty item node
		 * @param {integer} 	arg_item_index		item index
		 * @return {object}		jQuery object node
		 */
		render_item_node: function(arg_item_index)
		{
			var self = this;
			var context = 'render_item_node(index)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			self.enter(context, '');
			
			// NOT IMPLEMENTED HERE
			
			self.leave(context, self.msg_default_empty_implementation);
			self.pop_trace();
			return $('<div>');
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an divider item content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		render_item_divider: function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_divider(deferred,jqo,content)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an item HTML content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		render_item_html: function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_html(deferred,jqo,content)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			self.enter(context, '');
			
			arg_item_jqo.html(arg_item_content);
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an item TEXT content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		render_item_text: function(arg_deferred, arg_item_jqo, arg_item_content, arg_item_record)
		{
			var self = this;
			var context = 'render_item_text(deferred,jqo,content)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			self.enter(context, '');
			
			
			// console.log(arg_item_jqo, context);
			var span_jqo = $('<span>');
			span_jqo.html(arg_item_content);
			arg_item_jqo.append(span_jqo);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an item VIEW content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		render_item_view: function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_view(deferred,jqo,content)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			self.enter(context, '');
			
			
			// GET CURRENT BACKEND
			var backend = Devapt.get_current_backend();
			self.assertNotNull(context, 'backend', backend);
			
			// RENDER VIEW
			arg_deferred.then( backend.render_view(arg_item_jqo, arg_item_content) );
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an item OBJECT content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {object}		arg_item_object
		 * @return {object}		jQuery object node
		 */
		render_item_object: function(arg_deferred, arg_item_jqo, arg_item_object)
		{
			var self = this;
			var context = 'render_item_object(deferred,jqo,content)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			self.enter(context, '');
			
			
			// BUILD NODE CONTENT
			var tags_object = {};
			if (self.items_iterator === 'records')
			{
				for(field_index in self.items_fields)
				{
					var field_name = self.items_fields[field_index];
					tags_object[field_name] = arg_item_object[field_name];
				}
			}
			else
			{
				tags_object = arg_item_object;
			}
			
			
			// GET INPUTS
			var has_input = self.has_input ? self.has_input() : false;
			if (has_input)
			{
				self.step(context, 'has inputs');
				
				self.assertObject(context, 'self.items_model_obj', self.items_model_obj);
				
				var access = self.items_model_obj.get_access();
				self.value(context, 'access', access);
				
				var has_create = access.create;
				var has_read = access.read;
				var has_update = access.update;
				var has_delete = access['delete'];
				
				// TODO MODEL ACCESS
				if (has_update)
				{
					if (self.items_iterator === 'records')
					{
						for(field_index in self.items_fields)
						{
							var field_name = self.items_fields[field_index];
							var field_value = tags_object[field_name];
							var field_def_obj = self.items_model_obj.get_field(field_name);
							
							tags_object[field_name] = '<div id="' + field_name + '_input_id">';
							tags_object[field_name + '_jqo'] = self.get_input(field_def_obj, null, field_value);
							
							// console.log(field_name, self.name);
							// console.log(field_def_obj, 'field_def_obj');
							// console.log(tags_object[field_name], 'tags_object[field_name]');
							// console.log(tags_object[field_name + '_jqo'], 'tags_object[field_name + _jqo]');
						}
					}
					
					else if (self.items_iterator === 'fields')
					{
						var field_name = tags_object.field_name;
						var field_value = tags_object.field_value;
						var field_def_obj = self.items_model_obj.get_field(field_name);
						
						tags_object['field_value'] = '<div id="' + field_name + '_input_id">';
						tags_object[field_name + '_jqo'] = self.get_input(field_def_obj, null, field_value);
						
						// console.log(field_name, self.name);
						// console.log(field_def_obj, 'field_def_obj');
						// console.log(tags_object[field_name], 'tags_object[field_name]');
						// console.log(tags_object[field_name + '_jqo'], 'tags_object[field_name + _jqo]');
					}
				}
			}
			
			
			// RENDER ITEM
			if ( DevaptTypes.is_not_empty_str(self.items_format) )
			{
				var content = DevaptTemplate.render(self.items_format, tags_object);
				// console.log(tags_object, 'tags_object');
				// console.log(content, 'content');
				// console.log(arg_item_object, 'arg_item_object');
				self.render_item_text(arg_deferred, arg_item_jqo, content);
			}
			else
			{
				// console.log(arg_item_object, 'arg_item_object');
				self.render_item_text(arg_deferred, arg_item_jqo, 'todo');
			}
			
			
			// RENDER INPUTS
			if (has_input)
			{
				if (self.items_iterator === 'records')
				{
					self.step(context, 'render inputs for records');
					
					for(field_index in self.items_fields)
					{
						var field_name = self.items_fields[field_index];
						var input_jqo = tags_object[field_name + '_jqo'];
						var input_div_jqo = $('#' + field_name + '_input_id', arg_item_jqo);
						input_div_jqo.append(input_jqo);
						// console.log(field_name, self.name);
						// console.log(input_jqo, 'input_jqo');
						// console.log(input_div_jqo, 'input_div_jqo');
						// console.log(arg_item_jqo, 'arg_item_jqo');
					}
				}
				
				else if (self.items_iterator === 'fields')
				{
					self.step(context, 'render inputs for fields');
					
					var field_name = tags_object.field_name;
					
					var input_jqo = tags_object[field_name + '_jqo'];
					var input_div_jqo = $('#' + field_name + '_input_id', arg_item_jqo);
					input_div_jqo.append(input_jqo);
					
					// console.log(field_name, self.name);
					// console.log(input_jqo, 'input_jqo');
					// console.log(input_div_jqo, 'input_div_jqo');
					// console.log(arg_item_jqo, 'arg_item_jqo');
				}
			}
			
			
			// ATTACH RECORD
			arg_item_jqo.data('record', arg_item_object);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an item RECORD content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {array}		arg_item_array
		 * @return {object}		jQuery object node
		 */
		render_item_array: function(arg_deferred, arg_item_jqo, arg_item_array)
		{
			var self = this;
			var context = 'render_item_array(deferred,jqo,content)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			self.enter(context, '');
			
			
			// BUILD NODE CONTENT
			var tags_object = {};
			for(field_index in self.items_fields)
			{
				var field_name = self.items_fields[field_index];
				tags_object[field_index] = arg_item_object[field_name];
			}
			
			var content = DevaptTemplate.render(self.items_format, tags_object);
			self.render_item_text(arg_deferred, arg_item_jqo, content);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an item CALLBACK content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		jQuery object node
		 */
		render_item_callback: function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_callback(deferred,jqo,content)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			self.enter(context, '');
			
			// TODO render_item_object
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				End the render of the container
		 * @param {object}			arg_deferred		deferred object
		 * @param {string|object}	arg_item_content	item content
		 * @param {integer} 		arg_item_index		item index
		 * @param {string} 			arg_item_type		item type
		 * @return {boolean}
		 */
		render_item: function(arg_deferred, arg_item_content, arg_item_index, arg_item_type)
		{
			var self = this;
			var context = 'render_item(deferred,content,index,type)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			// self.trace = true
			self.enter(context, '');
			self.value(context, 'arg_item_content', arg_item_content);
			
			
			// CREATE EMPTY ITEMNODE
			var node_jqo = self.render_item_node(arg_item_index);
			node_jqo.addClass('devapt-container-visible');
			
			// FILL ITEM NODE
			// console.log(arg_item_type, 'arg_item_type');
			switch(arg_item_type)
			{
				case 'divider':
				{
					if ( ! self.has_divider )
					{
						self.leave(context, 'bad divider item');
						self.pop_trace();
						return false;
					}
					self.assertFunction(context, 'self.render_item_divider', self.render_item_divider);
					node_jqo = self.render_item_divider(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'html':
				{
					self.assertFunction(context, 'self.render_item_html', self.render_item_html);
					node_jqo = self.render_item_html(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'text':
				{
					self.assertFunction(context, 'self.render_item_text', self.render_item_text);
					node_jqo = self.render_item_text(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'view':
				{
					self.assertFunction(context, 'self.render_item_view', self.render_item_view);
					node_jqo = self.render_item_view(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'record':
				case 'object':
				{
					self.assertFunction(context, 'self.render_item_object', self.render_item_object);
					node_jqo = self.render_item_object(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				case 'array':
				{
					self.assertFunction(context, 'self.render_item_array', self.render_item_array);
					
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
					self.assertFunction(context, 'self.render_item_callback', self.render_item_callback);
					node_jqo = self.render_item_callback(arg_deferred, node_jqo, arg_item_content);
					break;
				}
				default:
				{
					self.error('bad item type [' + arg_item_type + '] for [' + self.name + ']');
					self.leave(context, self.msg_failure);
					self.pop_trace();
					return false;
				}
			}
			
			// APPEND ITEM NODE
			var record = {
				index: arg_item_index,
				type: arg_item_type,
				position: false,
				is_active:false,
				width: false,
				heigth: false,
				node: node_jqo
			};
			// console.log(self, context + '.items_objects');
			self.append_item_node(node_jqo, record);
			self.items_objects.push(record);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return true;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Append an item to the view
		 * @param {object}		arg_item_jqo		item jQuery object
		 * @param {object}		arg_item_record		item record
		 * @return {nothing}
		 */
		append_item_node: function(arg_item_jqo, arg_item_record)
		{
			var self = this;
			var context = 'append_item_node(item node, record)';
			self.push_trace(self.trace, self.mixin_trace_render_items);
			self.enter(context, '');
			
			if ( ! self.items_jquery_parent)
			{
				console.log(self.name, 'self.name');
				console.log(self.items_jquery_parent, 'self.items_jquery_parent');
				console.log(arg_item_jqo, 'arg_item_jqo');
			}
			self.items_jquery_parent.append(arg_item_jqo);
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return true;
		}
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinRenderItems
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	// DevaptMixinRenderItems.register_options = function(arg_prototype)
	// {
	// };
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-08-23',
			'updated':'2014-12-06',
			'description':'Mixin methods for datas items rendering feature for containers.'
		}
	};
	var DevaptMixinRenderItemsClass = new DevaptClass('DevaptMixinRenderItems', null, class_settings);
	
	// METHODS
	// DevaptMixinRenderItemsClass.infos.ctor = DevaptMixinRenderItems.mixin_init_pagination;
	DevaptMixinRenderItemsClass.add_public_method('render_item_node', {}, DevaptMixinRenderItems.render_item_node);
	DevaptMixinRenderItemsClass.add_public_method('render_item_divider', {}, DevaptMixinRenderItems.render_item_divider);
	DevaptMixinRenderItemsClass.add_public_method('render_item_html', {}, DevaptMixinRenderItems.render_item_html);
	DevaptMixinRenderItemsClass.add_public_method('render_item_text', {}, DevaptMixinRenderItems.render_item_text);
	DevaptMixinRenderItemsClass.add_public_method('render_item_view', {}, DevaptMixinRenderItems.render_item_view);
	DevaptMixinRenderItemsClass.add_public_method('render_item_object', {}, DevaptMixinRenderItems.render_item_object);
	DevaptMixinRenderItemsClass.add_public_method('render_item_array', {}, DevaptMixinRenderItems.render_item_array);
	DevaptMixinRenderItemsClass.add_public_method('render_item_callback', {}, DevaptMixinRenderItems.render_item_callback);
	DevaptMixinRenderItemsClass.add_public_method('render_item', {}, DevaptMixinRenderItems.render_item);
	DevaptMixinRenderItemsClass.add_public_method('append_item_node', {}, DevaptMixinRenderItems.append_item_node);
	
	// MIXINS
	
	// PROPERTIES
	
	// BUILD CLASS
	DevaptMixinRenderItemsClass.build_class();
	
	
	return DevaptMixinRenderItemsClass;
}
);