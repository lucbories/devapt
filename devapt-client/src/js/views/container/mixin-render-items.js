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

'use strict'
define(
['Devapt', 'core/types', 'core/class', 'core/classes', 'core/template'],
function(Devapt, DevaptTypes, DevaptClass, DevaptClasses, DevaptTemplate)
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
		mixin_trace_render_items: false,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_init_render_items: function(self)
		{
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
			self.enter(context, '');
			self.value(context, 'arg_item_content', arg_item_content);
			
			
			// GET CURRENT BACKEND
			var backend = Devapt.get_current_backend();
			self.assertNotNull(context, 'backend', backend);
			
			// RENDER VIEW
			arg_deferred.then(
				function()
				{
					var promise = backend.render_view(arg_item_jqo, arg_item_content);
					promise.then(
						function()
						{
							var view = DevaptClasses.get_instance(arg_item_content);
							// console.log(view.label, self.name);
							arg_item_jqo.attr('devapt-label', view.label);
						}
					);
				}
			);
			
			
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
			self.enter(context, '');
			
			
			// ITERATOR ON FIELDS
			if (self.items_iterator === 'fields')
			{
				var result_jqo = self.render_item_object_fields(arg_deferred, arg_item_jqo, arg_item_object);
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return result_jqo;
			}
			
			if (self.items_iterator === 'records')
			{
				var result_jqo = self.render_item_object_records(arg_deferred, arg_item_jqo, arg_item_object);
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return result_jqo;
			}
			
			
			self.leave(context, self.msg_failure);
			self.pop_trace();
			return null;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an item OBJECT content with records iterator
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {object}		arg_item_object
		 * @return {object}		jQuery object node
		 */
		render_item_object_records: function(arg_deferred, arg_item_jqo, arg_item_object)
		{
			var self = this;
			var context = 'render_item_object_records(deferred,jqo,content)';
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
			self.enter(context, '');
			
			
			// BUILD NODE CONTENT
			var tags_object = {};
			for(var field_index in self.items_fields)
			{
				var field_name = self.items_fields[field_index];
				tags_object[field_name] = arg_item_object[field_name];
			}
			
			
			// GET HAS INPUTS
			var has_input = self.has_input ? self.has_input() : false;
			self.value(context, 'has inputs', has_input);
			
			
			// GET ACCESS
			self.assertObject(context, 'self.items_model_obj', self.items_model_obj);
			var access = self.items_model_obj.get_access();
			self.value(context, 'access', access);
			
			
			// SHOULD RENDER INPUTS
			if (has_input && (access.update || access.create || access['delete']) )
			{
				self.step(context, 'has inputs');
				
				for(var field_index in self.items_fields)
				{
					var field_name = self.items_fields[field_index];
					self.value(context, 'field_name', field_name);
					self.value(context, 'self.items_input_fields', self.items_input_fields);
				
					if (self.items_input_fields.indexOf(field_name) < 0)
					{
						self.step(context, 'field is skipped');
						continue;
					}
					
					self.step(context, 'field has input');
					
					var field_value = tags_object[field_name];
					var field_def_obj = self.items_model_obj.get_field(field_name);
					
					var uid = Devapt.uid();
					var input_div_jqo = $('<div id="' + field_name + '_' + uid + '_input_id">');
					var input_jqo = self.get_input(arg_deferred, field_def_obj, null, field_value, true, access);
					if (! input_jqo)
					{
						// RENDER ITEM
						if ( DevaptTypes.is_not_empty_str(self.items_format) )
						{
							self.step(context, 'items_format is a valid string');
							
							var content = DevaptTemplate.render(self.items_format, tags_object);
							self.render_item_text(arg_deferred, input_div_jqo, content);
						}
						else
						{
							self.step(context, 'items_format is a not valid string');
							
							var field_value = tags_object[field_name] ? tags_object[field_name] : field_def_obj.field_value.defaults;
							self.render_item_text(arg_deferred, input_div_jqo, field_value);
						}
					}
					
					input_div_jqo.append(input_jqo);
					arg_item_jqo.append(input_div_jqo);
				}
				
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return arg_item_jqo;
			}
			
			
			// RENDER ITEM
			if ( DevaptTypes.is_not_empty_str(self.items_format) )
			{
				self.step(context, 'items_format is a valid string');
				
				var content = DevaptTemplate.render(self.items_format, tags_object);
				self.render_item_text(arg_deferred, arg_item_jqo, content);
			}
			else
			{
				self.step(context, 'items_format is a not valid string');
				
				var field_value = tags_object[field_name] ? tags_object[field_name] : field_def_obj.field_value.defaults;
				self.render_item_text(arg_deferred, arg_item_jqo, field_value);
			}
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderItems
		 * @desc				Render an item OBJECT content with fields iterator
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {object}		arg_item_object
		 * @return {object}		jQuery object node
		 */
		render_item_object_fields: function(arg_deferred, arg_item_jqo, arg_item_object)
		{
			var self = this;
			var context = 'render_item_object_fields(deferred,jqo,content)';
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
			self.enter(context, '');
			
			
			// BUILD NODE CONTENT
			var tags_object = arg_item_object;
			
			
			// GET HAS INPUTS
			var has_input = self.has_input ? self.has_input() : false;
			self.value(context, 'has inputs', has_input);
			
			
			// GET ACCESS
			self.assertObject(context, 'self.items_model_obj', self.items_model_obj);
			var access = self.items_model_obj.get_access();
			self.value(context, 'access', access);
			
			
			// SHOULD RENDER INPUTS
			if (has_input && (access.update || access.create || access['delete']) )
			{
				self.step(context, 'has inputs');
				
				var field_name = tags_object.field_name;
				self.value(context, 'field_name', field_name);
				self.value(context, 'self.items_input_fields', self.items_input_fields);
				
				if (self.items_input_fields.indexOf(field_name) >= 0)
				{
					self.step(context, 'field has input');
					
					var field_value = tags_object.field_value;
					var field_def_obj = self.items_model_obj.get_field(field_name);
					
					var uid = Devapt.uid();
					var input_div_html = '<div id="' + field_name + '_' + uid +  '_input_id">';
					var input_div_jqo = $(input_div_html);
					var input_jqo = self.get_input(arg_deferred, field_def_obj, null, field_value, true);
					
					input_div_jqo.append(input_jqo);
					arg_item_jqo.append(input_div_jqo);
					
					tags_object['field_value'] = input_div_html;
					tags_object[field_name + '_jqo'] = input_jqo;
				}
				
				
				self.leave(context, self.msg_success);
				self.pop_trace();
				return arg_item_jqo;
			}
			
			
			// RENDER ITEM
			if ( DevaptTypes.is_not_empty_str(self.items_format) )
			{
				self.step(context, 'items_format is a valid string');
				
				
				
				// TODO TEMPLATE ON FIELDS INPUTS
				
				
				var content = DevaptTemplate.render(self.items_format, tags_object);
				self.render_item_text(arg_deferred, arg_item_jqo, content);
			}
			else
			{
				self.step(context, 'items_format is a not valid string');
				
				self.render_item_text(arg_deferred, arg_item_jqo, 'todo');
			}
			
			
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
			self.enter(context, '');
			
			
			// BUILD NODE CONTENT
			var tags_object = {};
			for(var field_index in self.items_fields)
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
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
					arg_item_content.container_item_index = arg_item_index;
					// arg_item_content.container_item_type = arg_item_type;
					// arg_item_content.container_item_node = node_jqo;
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
			self.push_trace(self.trace, DevaptMixinRenderItems.mixin_trace_render_items);
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
	DevaptMixinRenderItemsClass.add_public_method('render_item_object_records', {}, DevaptMixinRenderItems.render_item_object_records);
	DevaptMixinRenderItemsClass.add_public_method('render_item_object_fields', {}, DevaptMixinRenderItems.render_item_object_fields);
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