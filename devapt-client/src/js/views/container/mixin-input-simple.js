/**
 * @file        views/mixin-input-simple.js
 * @desc        Mixin for datas simple input feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-01-04
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'md5', 'sha1'],
function(Devapt, DevaptTypes, DevaptClass, MD5, SHA1)
{
	/**
	 * @mixin				DevaptMixinInputSimple
	 * @public
	 * @desc				Mixin of methods for datas form features
	 */
	var DevaptMixinInputSimple = 
	{
		/**
		 * @memberof			DevaptMixinInputSimple
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_input_simple: false,
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInputSimple
		 * @desc				Get a simple input tag for the given field
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @return {object}		jQuery node object
		 */
		get_simple_input: function(arg_field_obj, arg_value)
		{
			var self = this;
			var context = 'get_simple_input(field, value)';
			self.push_trace(self.trace, DevaptMixinInputSimple.mixin_trace_input_simple);
			self.enter(context, '');
			
			
			// GET FIELD ATTRIBUTES
			var value_str = arg_value;
			var field_obj = arg_field_obj;
			var type_str = DevaptTypes.to_string(field_obj.field_value.type, 'string').toLocaleLowerCase();
			var name_str = DevaptTypes.to_string(field_obj.name, null);
			var label_str = DevaptTypes.to_string(field_obj.label, null);
			self.value(context, 'type_str', type_str);
			self.value(context, 'name_str', name_str);
			self.value(context, 'label_str', label_str);
			
			
			// GET RESULT INPUT NODE
			var node_jqo = null;
			switch(type_str)
			{
				case 'string':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_string').val(value_str); break;
				case 'integer':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_integer').val(value_str); break;
				case 'float':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_float').val(value_str); break;
				case 'boolean':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_boolean').val(value_str); break;
				case 'email':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_email').val(value_str); break;
				case 'date':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_date').val(value_str); break;
				case 'time':		node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_time').val(value_str); break;
				case 'datetime':	node_jqo = $('<input type="text">').attr('name', name_str).addClass('devapt_input_datetime').val(value_str); break;
			}
			
			
			// CHECK RESULT INPUT NODE
			if (! node_jqo)
			{
				self.leave(context, Devapt.msg_failure);
				self.pop_trace();
				return null;
			}
			
			
			// SAVE FILLED VALUE
			node_jqo.data('value_filled', value_str);
			// node_jqo.data('value_changed', null);
			
			
			// SET PLACEHOLDER
			if (field_obj.placeholder)
			{
				self.step(context, 'sett placeholder');
				
				node_jqo.attr('placeholder', field_obj.placeholder);
			}
			
			
			// STANDARD INPUT EVENT CALLBACK
			var change_cb = function(event) {
				self.trace=true;
				self.step(context, 'on change callback');
				
				var event_node_jqo = $(event.target);
				var value_filled = event_node_jqo.data('value_filled');
				var value = event_node_jqo.val();
				self.value(context, 'value_filled', value_filled);
				self.value(context, 'value', value);
				
				// ON VALUE CHANGE
				if (value !== value_filled)
				{
					self.step(context, 'values are different');
					
					event_node_jqo.data('value_filled', value);
					// console.log(value, 'input changed');
					
					// VALIDATE VALUE
					var validate_status = self.validate_input(field_obj, value);
					if (! validate_status.is_valid)
					{
						self.step(context, 'validation failure');
						
						event_node_jqo.parent().addClass('devapt_validate_error');
						
						if ( Devapt.has_current_backend() )
						{
							Devapt.get_current_backend().notify_error(validate_status.error_label);
						}
					}
					else
					{
						self.step(context, 'validation success');
						
						event_node_jqo.parent().removeClass('devapt_validate_error');
						
						// EMIT CHANGE EVENTS
						self.fire_event('devapt.input.changed', [field_obj, value_filled, value]);
						self.on_input_changed(field_obj, value_filled, value);
					}
				}
			};
			
			
			// SET EVENTS HANDLES
			node_jqo.on('change', change_cb);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
			return node_jqo;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinInputSimple
		 * @desc				Get a password input tag for the given field
		 * @param {object}		arg_field_obj			field definition attributes
		 * @param {string}		arg_value				field value
		 * @return {object}		jQuery node object
		 */
		get_password_input: function(arg_field_obj, arg_value)
		{
			var self = this;
			var context = 'get_password_input(field, value)';
			self.push_trace(self.trace, DevaptMixinInputSimple.mixin_trace_input_simple);
			self.enter(context, '');
			
			
			// GET FIELD ATTRIBUTES
			var field_obj = arg_field_obj;
			var value_str = arg_value;
			var name_str = DevaptTypes.to_string(field_obj.name, null);
			var label_str = DevaptTypes.to_string(field_obj.label, null);
			self.value(context, 'name_str', name_str);
			self.value(context, 'label_str', label_str);
			self.value(context, 'value_str', value_str);
			
			
			// GET RESULT INPUT NODE
			var node_jqo = $('<div>').attr('name', name_str).addClass('devapt_input_password');
			var pass0_jqo = $('<input type="hidden">').attr('name', name_str + '_pass0').val(value_str);
			var pass1_jqo = $('<input type="password">').attr('name', name_str + '_pass1');
			var pass2_jqo = $('<input type="password">').attr('name', name_str + '_pass2');
			node_jqo.append(pass0_jqo).append(pass1_jqo).append(pass2_jqo);
			
			
			// CHECK RESULT INPUT NODE
			if (! node_jqo)
			{
				self.leave(context, Devapt.msg_failure);
				self.pop_trace();
				return null;
			}
			
			
			
			// SAVE FILLED VALUE
			node_jqo.data('value_filled', value_str);
//			 node_jqo.data('value_changed', null);
			
			
			// SET PLACEHOLDER
			if (field_obj.placeholder)
			{
				pass1_jqo.attr('placeholder', field_obj.placeholder);
				pass2_jqo.attr('placeholder', field_obj.placeholder);
			}
			
			
			// PASSWORD INPUT EVENT CALLBACK
			var change_pass_cb = function(event) {
				self.step(context, 'change password callback');
				
				var node_jqo = $(event.target);
				var value_filled = node_jqo.data('value_filled');
				var value = null;
				
				var input0_jqo = $('input:eq(0)', node_jqo.parent());
				var input1_jqo = $('input:eq(1)', node_jqo.parent());
				var input2_jqo = node_jqo;
				
				// CHECK PASSWORD CONFORMATION
				var value1 = input1_jqo.val();
				var value2 = input2_jqo.val();
				if (value1 !== value2)
				{
					self.notify_alert('password confirmation is different');
					return true;
				}
				
				// HASH PASSWORD IF NEEDED
				value = value1;
				// TODO CHOOSE HASH METHOD
				if (field_obj.hash === 'md5')
				{
					value = window.CryptoJS.MD5(' + value + ').toString();
				}
				else if (field_obj.hash === 'sha1')
				{
					value = window.CryptoJS.SHA1(' + value + ').toString();
				}
				else
				{
					self.error(context, 'unknow HASH method [' + field_obj.hash + ']');
				}
				
				// TEST IF PASSWORD HAS CHANGED
				if (value !== value_filled)
				{
					input0_jqo.val(value);
					node_jqo.data('value_filled', value);
					// console.log(value, 'pass input changed');
					self.fire_event('devapt.input.changed', [field_obj, value_filled, value]);
					self.on_input_changed(field_obj, value_filled, value);
				}
			};
			
			
			// SET EVENTS HANDLES
			pass2_jqo.on('change', change_pass_cb);
			
			
			self.leave(context, Devapt.msg_success);
			self.pop_trace();
			return node_jqo;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-01-04',
			'updated':'2015-01-06',
			'description':'Mixin methods for datas simple input feature for containers.'
		}
	};
	var DevaptMixinInputSimpleClass = new DevaptClass('DevaptMixinInputSimple', null, class_settings);
	
	// METHODS
	DevaptMixinInputSimpleClass.add_public_method('get_simple_input', {}, DevaptMixinInputSimple.get_simple_input);
	DevaptMixinInputSimpleClass.add_public_method('get_password_input', {}, DevaptMixinInputSimple.get_password_input);
	
	// BUILD MIXIN CLASS
	DevaptMixinInputSimpleClass.build_class();
	
	
	return DevaptMixinInputSimpleClass;
}
);