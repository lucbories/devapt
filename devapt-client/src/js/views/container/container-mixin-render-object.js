/**
 * @file        views/container/container-mixin-render-object.js
 * @desc        Mixin for datas items rendering feature for containers
 * @see			DevaptMixinRenderObject
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-02-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'core/template'],
function(Devapt, DevaptTypes, DevaptClass, DevaptTemplate)
{
	/**
	 * @mixin				DevaptMixinRenderObject
	 * @public
	 * @desc				Mixin of methods for datas items rendering features
	 */
	var DevaptMixinRenderObject = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinRenderObject
		 * @desc				Render an item OBJECT content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {object}		arg_item_object
		 * @param {boolean}		arg_update			(optional) if true do not create an other node, only update
		 * @return {object}		jQuery object node
		 */
		render_item_object: function(arg_deferred, arg_item_jqo, arg_item_object, arg_update)
		{
			var self = this;
			var context = 'render_item_object(deferred,jqo,content)';
			self.enter(context, '');
			
			
			// CHECK NODE
			if ( ! DevaptTypes.is_object(arg_item_jqo) )
			{
				self.leave(context, Devapt.msg_failure);
				return null;
			}
			
			// ITERATOR ON FIELDS
			var result_jqo = null;
			if (self.items_iterator === 'fields')
			{
				result_jqo = self.render_item_object_fields(arg_deferred, arg_item_jqo, arg_item_object, arg_update);
				
				self.leave(context, Devapt.msg_success);
				return result_jqo;
			}
			
			if (self.items_iterator === 'records' || self.items_iterator === 'field_editor')
			{
				result_jqo = self.render_item_object_records(arg_deferred, arg_item_jqo, arg_item_object, arg_update);
				
				self.leave(context, Devapt.msg_success);
				return result_jqo;
			}
			
			
			self.leave(context, Devapt.msg_failure);
			return null;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderObject
		 * @desc				Render an item OBJECT content with records iterator
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {object}		arg_item_object		plain object
		 * @param {boolean}		arg_update			(optional) if true do not create an other node, only update
		 * @return {object}		jQuery object node
		 */
		render_item_object_records: function(arg_deferred, arg_item_jqo, arg_item_object, arg_update)
		{
			var self = this;
			var context = 'render_item_object_records(deferred,jqo,content)';
			self.enter(context, '');
			
			
			// UPDATE ONLY ?
			arg_update = DevaptTypes.to_boolean(arg_update, false);
			
			
			// BUILD NODE CONTENT
			var tags_object = {};
			for(var field_index in self.items_fields)
			{
				var field_name = self.items_fields[field_index];
				tags_object[field_name] = arg_item_object[field_name];
			}
			
			
			// GET RECORD NODE
			var record_jqo = arg_update ? arg_item_jqo : self.render_item_record_node(arg_item_jqo);
			
			
			// GET HAS INPUTS
			var has_input = self.has_input ? self.has_input() : false;
			self.value(context, 'has inputs', has_input);
			
			
			// SIMPLE ONE SHOT RECORD RENDER
			if (! has_input && ! DevaptTypes.is_not_empty_array(self.items_formats))
			{
				if ( DevaptTypes.is_not_empty_str(self.items_format) )
				{
					self.step(context, 'items_format is a valid string');
					
					var content = DevaptTemplate.render(self.items_format, tags_object);
					self.value(context, 'tags_object', tags_object);
					self.value(context, 'self.items_format', self.items_format);
					self.value(context, 'content', content);
					
					if (arg_update)
					{
						// console.log('remove children', self.name + '.' + context + '.update?');
						record_jqo.children().remove();
					}
					self.render_item_text(arg_deferred, record_jqo, content);
					
					self.leave(context, Devapt.msg_success);
					return arg_item_jqo;
				}
			}
			
			
			// GET ACCESS
			var access = {read:true,update:false,create:false,'delete':false};
			if ( DevaptTypes.is_object(self.items_model_obj) )
			{
				access = self.items_model_obj.get_access();
			}
			self.value(context, 'access', access);
			
			
			// LOOP ON FIELDS
			var field_name = null;
			for(var field_index in self.items_fields)
			{
				// GET FIELD ATTRIBUTES
				field_name = self.items_fields[field_index];
				self.value(context, 'field_name', field_name);
				self.value(context, 'self.items_input_fields', self.items_input_fields);
				
				var field_def_obj = null;
				if ( DevaptTypes.is_object(self.items_model_obj) )
				{
					field_def_obj = self.items_model_obj.get_field(field_name);
				}
				var field_value = tags_object[field_name] ? tags_object[field_name] : (field_def_obj ? field_def_obj.field_value.defaults : '');
				
				
				// GET FIELD NODE
				// TODO NOT YET IMPLEMENTED
				var field_jqo = self.render_item_field_node(record_jqo);
				
				
				// RENDER INPUT
				if ( field_def_obj && has_input && (access.update || access.create || access['delete']) )
				{
					self.step(context, 'has inputs');
					
					// SKIP FIELD VALUE IF NEEDED
					if (self.items_input_fields.indexOf(field_name) < 0)
					{
						self.step(context, 'field is skipped');
						continue;
					}
					
					self.step(context, 'field has input');
					
					// GET INPUT NODE
					var uid = Devapt.uid();
					var input_div_jqo = window.$('<div id="' + field_name + '_' + uid + '_input_id">');
					var input_jqo = self.get_input(arg_deferred, field_def_obj, null, field_value, true, access);
					field_jqo.append(input_div_jqo);
					
					// TEST INPUT NODE
					if (input_jqo)
					{
						input_div_jqo.append(input_jqo);
						continue;
					}
					
					field_jqo = input_div_jqo;
				}
				
				
				// RENDER ITEM WITHOUT INPUT
				if ( DevaptTypes.is_not_empty_array(self.items_formats) )
				{
					self.step(context, 'items_formats is a valid array of strings');
					
					var field_format = self.items_formats.length > field_index ? self.items_formats[field_index] : self.items_formats[ self.items_formats.length - 1 ];
					var content = DevaptTemplate.render(field_format, tags_object);
					self.render_item_text(arg_deferred, field_jqo, content);
				}
				else
				{
					self.step(context, 'items_format is a not valid string');
					
					self.render_item_text(arg_deferred, field_jqo, field_value);
				}
			}
			
			
			self.leave(context, Devapt.msg_success);
			return arg_item_jqo;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderObject
		 * @desc				Render an item OBJECT content with fields iterator
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {object}		arg_item_object
		 * @param {boolean}		arg_update			(optional) if true do not create an other node, only update
		 * @return {object}		jQuery object node
		 */
		render_item_object_fields: function(arg_deferred, arg_item_jqo, arg_item_object, arg_update)
		{
			var self = this;
			var context = 'render_item_object_fields(deferred,jqo,content,update)';
			self.enter(context, '');
			
			
			// BUILD NODE CONTENT
			var tags_object = arg_item_object;
			
			
			// GET HAS INPUTS
			var has_input = self.has_input ? self.has_input() : false;
			self.value(context, 'has inputs', has_input);
			
			
			// GET ACCESS
			var access = {read:true,update:false,create:false,'delete':false};
			var field_def_obj = null;
			if ( DevaptTypes.is_object(self.items_model_obj) )
			{
				access = self.items_model_obj.get_access();
			}
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
					var field_def_obj = null;
					if ( DevaptTypes.is_object(self.items_model_obj) )
					{
						field_def_obj = self.items_model_obj.get_field(field_name);
					}
					
					// TODO SET AN EXISTING INPUT
//					if (arg_item_jqo.length === 1)
//					{
//						self.set_input(arg_deferred, arg_item_jqo, field_def_obj, null, field_value, true);
//						 
//						tags_object['field_value'] = input_div_html;
//						tags_object[field_name + '_jqo'] = input_jqo;
//					}
//					else
//					{
						// TODO UPDATE WITH EXISTING NODE
						var uid = Devapt.uid();
						var input_div_html = '<div id="' + field_name + '_' + uid +  '_input_id">';
						var input_div_jqo = window.$(input_div_html);
						var input_jqo = self.get_input(arg_deferred, field_def_obj, null, field_value, true);
						
						input_div_jqo.append(input_jqo);
						arg_item_jqo.append(input_div_jqo);
						
						tags_object['field_value'] = input_div_html;
						tags_object[field_name + '_jqo'] = input_jqo;
//					}
				}
				
				
				self.leave(context, Devapt.msg_success);
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
			
			
			self.leave(context, Devapt.msg_success);
			return arg_item_jqo;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-02-23',
			'updated':'2015-02-23',
			'description':'Mixin methods for datas items rendering feature for containers.'
		}
	};
	var DevaptMixinRenderObjectClass = new DevaptClass('DevaptMixinRenderObject', null, class_settings);
	
	// METHODS
	DevaptMixinRenderObjectClass.add_public_method('render_item_object', {}, DevaptMixinRenderObject.render_item_object);
	DevaptMixinRenderObjectClass.add_public_method('render_item_object_records', {}, DevaptMixinRenderObject.render_item_object_records);
	DevaptMixinRenderObjectClass.add_public_method('render_item_object_fields', {}, DevaptMixinRenderObject.render_item_object_fields);
	
	// PROPERTIES
	
	// BUILD MIXIN CLASS
	DevaptMixinRenderObjectClass.build_class();
	
	
	return DevaptMixinRenderObjectClass;
}
);